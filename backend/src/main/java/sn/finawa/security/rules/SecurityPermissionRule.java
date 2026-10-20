package sn.finawa.security.rules;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import sn.finawa.entity.enums.SecurityPermissions;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SecurityPermissionRule {
    static final String SECURITY_PERMISSION_API_SUFFIX = "/permissions";
    static final String SECURITY_PERMISSION_FILTER_BY_FEATURE = "/{featureName}";
    static final String SECURITY_PERMISSION_FEATURE_LIST = "/feature";

    @Bean
    public SecurityRule readAllPermissions() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.GET)
                .apiPattern(SECURITY_PERMISSION_API_SUFFIX)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.READ_PERMISSIONS)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule readAllPermissionsByFeature() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.GET)
                .apiPattern(SECURITY_PERMISSION_API_SUFFIX + SECURITY_PERMISSION_FILTER_BY_FEATURE)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.READ_PERMISSIONS)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule readAllFeatures() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.GET)
                .apiPattern(SECURITY_PERMISSION_API_SUFFIX + SECURITY_PERMISSION_FEATURE_LIST)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.READ_PERMISSIONS)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

}
