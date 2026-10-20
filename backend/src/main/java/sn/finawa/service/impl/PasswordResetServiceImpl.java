package sn.finawa.service.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sn.finawa.entity.PasswordResetTokenEntity;
import sn.finawa.entity.UserEntity;
import sn.finawa.exception.InvalidArgumentType;
import sn.finawa.exception.ResourceNotFoundException;
import sn.finawa.properties.MailProperties;
import sn.finawa.repository.EnterpriseRepository;
import sn.finawa.repository.PasswordResetTokenRepository;
import sn.finawa.repository.UserRepository;
import sn.finawa.service.MailService;
import sn.finawa.service.PasswordResetService;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class PasswordResetServiceImpl implements PasswordResetService {

    final PasswordResetTokenRepository tokenRepository;
    final UserRepository userRepository;
    final EnterpriseRepository enterpriseRepository;
    final MailService mailService;
    final MailProperties mailProperties;
    final PasswordEncoder passwordEncoder;

    @Value("${cors.allowed-origins:http://localhost:4200}")
    String corsAllowedOrigins;

    private static final String TEMPLATE_PASSWORD_RESET_MAIL = "mail/password-reset-email";
    private static final String MAIL_SUBJECT = "FINAWA - Réinitialisation de votre mot de passe";
    private static final long RESET_TOKEN_VALIDITY_SECONDS = 3600; // 1 heure

    @Override
    public void requestPasswordReset(String email) {
        if (email == null || email.isBlank()) {
            throw new InvalidArgumentType("L'adresse email est requise.");
        }

        var userOpt = userRepository.findByLogin(email.trim());
        if (userOpt.isEmpty()) {
            log.warn("Password reset requested for non-existent user: {}", email);
            // We do not reveal user non-existence for security, but return normally
            return;
        }

        UserEntity user = userOpt.get();

        // Clear existing reset tokens for this user
        tokenRepository.deleteAllByUser(user);

        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusSeconds(RESET_TOKEN_VALIDITY_SECONDS);

        PasswordResetTokenEntity tokenEntity = PasswordResetTokenEntity.builder()
                .token(token)
                .user(user)
                .expiryDate(expiryDate)
                .build();

        tokenRepository.save(tokenEntity);

        String origin = corsAllowedOrigins != null && !corsAllowedOrigins.isBlank()
                ? corsAllowedOrigins.split(",")[0].trim()
                : "http://localhost:4200";
        String resetUrl = origin + "/auth/reset-pass?token=" + token;

        String recipientName = enterpriseRepository.findByUserLogin(email.trim())
                .map(enterprise -> enterprise.getName())
                .orElse(user.getLogin());

        Map<String, Object> templateVars = new HashMap<>();
        templateVars.put("recipientName", recipientName);
        templateVars.put("resetUrl", resetUrl);

        try {
            mailService.sendHtmlMail(email.trim(), MAIL_SUBJECT, TEMPLATE_PASSWORD_RESET_MAIL, templateVars);
            log.info("Password reset email sent to {}", email);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", email, e.getMessage(), e);
        }
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        if (token == null || token.isBlank()) {
            throw new InvalidArgumentType("Le jeton de réinitialisation est manquant.");
        }
        if (newPassword == null || newPassword.length() < 8) {
            throw new InvalidArgumentType("Le nouveau mot de passe doit comporter au moins 8 caractères.");
        }

        PasswordResetTokenEntity tokenEntity = tokenRepository.findByToken(token.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Jeton de réinitialisation invalide ou introuvable."));

        if (tokenEntity.isUsed()) {
            throw new InvalidArgumentType("Ce lien de réinitialisation a déjà été utilisé.");
        }

        if (tokenEntity.isExpired()) {
            throw new InvalidArgumentType("Ce lien de réinitialisation a expiré. Veuillez faire une nouvelle demande.");
        }

        UserEntity user = tokenEntity.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenEntity.setUsedDate(LocalDateTime.now());
        tokenRepository.save(tokenEntity);

        log.info("Password successfully reset for user: {}", user.getLogin());
    }
}
