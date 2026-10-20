package sn.finawa.security.rules;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NoAuthRule {
    static final String AUTHENTICATION_API = "/auth/**";

    static final String H2_API = "/h2-console/**";
    static final String SWAGGER_API = "/swagger-ui/**";
    static final String SWAGGER_PAGE_API = "/swagger-ui.html";
    static final String API_DOCS = "/v3/api-docs/**";

    @Bean
    @Profile("local")
    public SecurityRule noAuthRuleLocal() {
        return SecurityRule.builder()
                .authenticated(false)
                .apiPattern(H2_API)
                .apiPattern(API_DOCS)
                .apiPattern(SWAGGER_API)
                .apiPattern(SWAGGER_PAGE_API)
                .build();
    }

    @Bean
    public SecurityRule noAuthRuleGlobal() {
        return SecurityRule.builder()
                .authenticated(false)
                .apiPattern(AUTHENTICATION_API)
                .build();
    }
}
