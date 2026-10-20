package sn.finawa.security.rules;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import sn.finawa.entity.enums.SecurityPermissions;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileRule {
    static final String PROFILE_API_PREFIX = "/profiles";
    static final String PROFILE_ID = "/{profileId}";

    @Bean
    public SecurityRule createProfile() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.POST)
                .apiPattern(PROFILE_API_PREFIX)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.ADD_PROFILE)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule readProfile() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.GET)
                .apiPattern(PROFILE_API_PREFIX)
                .apiPattern(PROFILE_API_PREFIX + PROFILE_ID)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.READ_PROFILE)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }


    @Bean
    public SecurityRule updateProfile() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.PUT)
                .apiPattern(PROFILE_API_PREFIX + PROFILE_ID)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.EDIT_PROFILE)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule deleteProfile() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.DELETE)
                .apiPattern(PROFILE_API_PREFIX + PROFILE_ID)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.DELETE_PROFILE)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }
}
