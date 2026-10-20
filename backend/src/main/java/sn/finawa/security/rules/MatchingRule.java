package sn.finawa.security.rules;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import sn.finawa.entity.enums.SecurityPermissions;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MatchingRule {
    static final String MATCHING_API_PREFIX = "/matching";
    static final String DOSSIER = "/dossier/{dossierId}";
    static final String PARTNER = "/partner/{partnerId}";
    static final String MATCHING_ID = "/{matchingId}";
    static final String UPDATE_STATUS = "/{matchingId}/status";

    @Bean
    public SecurityRule runMatching() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.POST)
                .apiPattern(MATCHING_API_PREFIX + DOSSIER)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.RUN_MATCHING)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule readMatching() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.GET)
                .apiPattern(MATCHING_API_PREFIX + DOSSIER)
                .apiPattern(MATCHING_API_PREFIX + PARTNER)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.READ_MATCHING)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule updateMatchingStatus() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.PATCH)
                .apiPattern(MATCHING_API_PREFIX + UPDATE_STATUS)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.EDIT_MATCHING)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule deleteMatching() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.DELETE)
                .apiPattern(MATCHING_API_PREFIX + MATCHING_ID)
                .apiPattern(MATCHING_API_PREFIX + DOSSIER)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.DELETE_MATCHING)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }
}
