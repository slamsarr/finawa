package sn.finawa.security.rules;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import sn.finawa.entity.enums.SecurityPermissions;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRule {
    static final String USER_API_PREFIX = "/users";
    static final String USER_ID = "/{userId}";
    static final String ACTIVATE = "/activate";
    static final String DEACTIVATE = "/deactivate";

    @Bean
    public SecurityRule createUsers() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.POST)
                .apiPattern(USER_API_PREFIX)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.ADD_USER)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule readUser() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.GET)
                .apiPattern(USER_API_PREFIX)
                .apiPattern(USER_API_PREFIX + USER_ID)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.READ_USER)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule updateUser() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.PUT)
                .apiPattern(USER_API_PREFIX)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.EDIT_USER)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule activateUserRule() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.PATCH)
                .apiPattern(USER_API_PREFIX + ACTIVATE + USER_ID)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.EDIT_STATUS_USER)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule deactivateUserRule() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.PATCH)
                .apiPattern(USER_API_PREFIX + DEACTIVATE + USER_ID)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.EDIT_STATUS_USER)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule deleteUser() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.DELETE)
                .apiPattern(USER_API_PREFIX + USER_ID)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.DELETE_USER)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule updatePasswordRule() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.POST)
                .apiPattern(USER_API_PREFIX + "/password-update")
                .authenticated(true)
                .build();
    }
}
