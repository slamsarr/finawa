package sn.finawa.security.rules;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;


@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EnterpriseRule {

    static final String ENTERPRISE_API_PREFIX = "/enterprises";
    static final String ENTERPRISE_ME = "/enterprises/me";
    static final String ENTERPRISE_ID = "/enterprises/{id}";

    @Bean
    public SecurityRule createEnterprises() {
        return SecurityRule.builder()
                .authenticated(false)
                .httpMethod(HttpMethod.POST)
                .apiPattern(ENTERPRISE_API_PREFIX)
                .build();
    }

    @Bean
    public SecurityRule getMyEnterpriseRule() {
        return SecurityRule.builder()
                .authenticated(true)
                .httpMethod(HttpMethod.GET)
                .apiPattern(ENTERPRISE_ME)
                .build();
    }

    @Bean
    public SecurityRule updateMyEnterpriseRule() {
        return SecurityRule.builder()
                .authenticated(true)
                .httpMethod(HttpMethod.PUT)
                .apiPattern(ENTERPRISE_ME)
                .build();
    }

    @Bean
    public SecurityRule readEnterpriseRule() {
        return SecurityRule.builder()
                .authenticated(true)
                .httpMethod(HttpMethod.GET)
                .apiPattern(ENTERPRISE_ID)
                .build();
    }

    @Bean
    public SecurityRule updateEnterpriseRule() {
        return SecurityRule.builder()
                .authenticated(true)
                .httpMethod(HttpMethod.PUT)
                .apiPattern(ENTERPRISE_ID)
                .build();
    }

    @Bean
    public SecurityRule readAllEnterprisesRule() {
        return SecurityRule.builder()
                .authenticated(true)
                .httpMethod(HttpMethod.GET)
                .apiPattern(ENTERPRISE_API_PREFIX)
                .build();
    }

    @Bean
    public SecurityRule deleteEnterpriseRule() {
        return SecurityRule.builder()
                .authenticated(true)
                .httpMethod(HttpMethod.DELETE)
                .apiPattern(ENTERPRISE_ID)
                .build();
    }
}
