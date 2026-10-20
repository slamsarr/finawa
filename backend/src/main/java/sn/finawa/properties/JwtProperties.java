package sn.finawa.properties;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;


@Data
@Component
@Validated
@FieldDefaults(level = AccessLevel.PRIVATE)
@ConfigurationProperties(prefix = "security-jwt")
public class JwtProperties {

    String base64Secret;

    long accessTokenValidityTime;

    long refreshTokenValidityTime;

    long refreshTokenValidityTimeRememberMe;
}
