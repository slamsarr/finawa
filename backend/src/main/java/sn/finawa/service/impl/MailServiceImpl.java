package sn.finawa.service.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import sn.finawa.properties.MailProperties;
import sn.finawa.service.MailService;

import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class MailServiceImpl implements MailService {

    JavaMailSender mailSender;
    TemplateEngine templateEngine;
    MailProperties mailProperties;

    @Async
    @Override
    public void sendHtmlMail(String to, String subject, String templateName, Map<String, Object> variables) {
        log.debug("Sending email to '{}' with subject '{}' using template '{}'", to, subject, templateName);
        try {
            Context context = new Context(Locale.FRENCH);
            if (variables != null) {
                context.setVariables(variables);
            }

            String content = templateEngine.process(templateName, context);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    mimeMessage,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            helper.setFrom(mailProperties.getFrom());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);

            mailSender.send(mimeMessage);
            log.info("Email successfully sent to '{}'", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to '{}': {}", to, e.getMessage(), e);
            throw new RuntimeException("Erreur lors de l'envoi de l'e-mail", e);
        }
    }
}
