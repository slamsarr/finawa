package sn.finawa.service.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sn.finawa.entity.UserEntity;
import sn.finawa.entity.VerificationTokenEntity;
import sn.finawa.exception.InvalidArgumentType;
import sn.finawa.exception.ResourceNotFoundException;
import sn.finawa.properties.MailProperties;
import sn.finawa.repository.EnterpriseRepository;
import sn.finawa.repository.UserRepository;
import sn.finawa.repository.VerificationTokenRepository;
import sn.finawa.service.MailService;
import sn.finawa.service.VerificationTokenService;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class VerificationTokenServiceImpl implements VerificationTokenService {

    final VerificationTokenRepository tokenRepository;
    final UserRepository userRepository;
    final EnterpriseRepository enterpriseRepository;
    final MailService mailService;
    final MailProperties mailProperties;

    @Value("${cors.allowed-origins")
    String corsAllowedOrigins;

    private static final String TEMPLATE_VERIFICATION_MAIL = "mail/verification-email";
    private static final String MAIL_SUBJECT = "FINAWA - Confirmation de votre adresse email";

    @Override
    public void sendVerificationEmail(UserEntity user, String recipientEmail, String recipientName) {
        log.debug("Generating verification token for user {}", user.getLogin());

        // Remove any previous unconfirmed tokens for this user
        tokenRepository.deleteAllByUser(user);

        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusSeconds(mailProperties.getTokenValiditySeconds());

        VerificationTokenEntity tokenEntity = VerificationTokenEntity.builder()
                .token(token)
                .user(user)
                .expiryDate(expiryDate)
                .build();

        tokenRepository.save(tokenEntity);

        String baseUrl = mailProperties.getVerificationUrl();
        if (baseUrl == null || baseUrl.isBlank()) {
            String origin = corsAllowedOrigins != null && !corsAllowedOrigins.isBlank()
                    ? corsAllowedOrigins.split(",")[0].trim()
                    : "http://localhost:4200";
            baseUrl = origin + "/auth/verify-email";
        }
        if (baseUrl.contains(",")) {
            baseUrl = baseUrl.split(",")[0].trim();
        }
        String verificationUrl = baseUrl + (baseUrl.contains("?") ? "&token=" : "?token=") + token;

        Map<String, Object> templateVars = new HashMap<>();
        templateVars.put("recipientName", recipientName != null && !recipientName.isBlank() ? recipientName : user.getLogin());
        templateVars.put("verificationUrl", verificationUrl);

        mailService.sendHtmlMail(recipientEmail, MAIL_SUBJECT, TEMPLATE_VERIFICATION_MAIL, templateVars);
    }

    @Override
    public void verifyToken(String token) {
        if (token == null || token.isBlank()) {
            throw new InvalidArgumentType("Le jeton de validation est manquant.");
        }

        VerificationTokenEntity tokenEntity = tokenRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Jeton de confirmation invalide ou introuvable."));

        if (tokenEntity.isConfirmed()) {
            throw new InvalidArgumentType("Cette adresse email a déjà été confirmée.");
        }

        if (tokenEntity.isExpired()) {
            throw new InvalidArgumentType("Ce lien de confirmation a expiré. Veuillez demander un nouveau lien.");
        }

        UserEntity user = tokenEntity.getUser();
        user.setActive(true);
        userRepository.save(user);

        tokenEntity.setConfirmedDate(LocalDateTime.now());
        tokenRepository.save(tokenEntity);

        log.info("User account successfully activated for login: {}", user.getLogin());
    }

    @Override
    public void resendVerificationEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new InvalidArgumentType("L'adresse email est requise.");
        }

        UserEntity user = userRepository.findByLogin(email)
                .orElseThrow(() -> new ResourceNotFoundException("Aucun compte trouvé avec l'adresse email : " + email));

        if (Boolean.TRUE.equals(user.getActive())) {
            throw new InvalidArgumentType("Ce compte est déjà actif. Vous pouvez vous connecter.");
        }

        String recipientName = enterpriseRepository.findByUserLogin(email)
                .map(enterprise -> enterprise.getName())
                .orElse(user.getLogin());

        sendVerificationEmail(user, email, recipientName);
        log.info("Resent verification email for user: {}", email);
    }
}
