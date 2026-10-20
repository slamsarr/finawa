package sn.finawa.security.rules;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import sn.finawa.entity.enums.SecurityPermissions;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PartnerRule {
    static final String PARTNER_API_PREFIX = "/partners";
    static final String PARTNER_ID = "/{partnerId}";
    static final String USER = "/user/{userId}";
    static final String ACTIVE = "/active";
    static final String TYPE = "/type/{type}";
    static final String ACTIVATE = "/{partnerId}/activate";
    static final String DEACTIVATE = "/{partnerId}/deactivate";

    @Bean
    public SecurityRule createPartner() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.POST)
                .apiPattern(PARTNER_API_PREFIX)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.ADD_PARTNER)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule readPartner() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.GET)
                .apiPattern(PARTNER_API_PREFIX)
                .apiPattern(PARTNER_API_PREFIX + PARTNER_ID)
                .apiPattern(PARTNER_API_PREFIX + USER)
                .apiPattern(PARTNER_API_PREFIX + ACTIVE)
                .apiPattern(PARTNER_API_PREFIX + TYPE)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.READ_PARTNER)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule updatePartner() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.PUT)
                .apiPattern(PARTNER_API_PREFIX)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.EDIT_PARTNER)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule activatePartner() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.PATCH)
                .apiPattern(ACTIVATE)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.EDIT_STATUS_PARTNER)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule deactivatePartner() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.PATCH)
                .apiPattern(DEACTIVATE)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.EDIT_STATUS_PARTNER)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule deletePartner() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.DELETE)
                .apiPattern(PARTNER_API_PREFIX + PARTNER_ID)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.DELETE_PARTNER)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }
}
