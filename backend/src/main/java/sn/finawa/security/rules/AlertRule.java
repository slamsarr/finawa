package sn.finawa.security.rules;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import sn.finawa.entity.enums.SecurityPermissions;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AlertRule {
    static final String ALERT_API_PREFIX = "/alerts";
    static final String ALERT_ID = "/{alertId}";

    @Bean
    public SecurityRule markAlertAsRead() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.POST)
                .apiPattern(ALERT_API_PREFIX + "/read" + ALERT_ID)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.READ_ALERT)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule readAllAlertsRule() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.GET)
                .apiPattern(ALERT_API_PREFIX)
                .apiPattern(ALERT_API_PREFIX + ALERT_ID)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.READ_ALERT)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule createAlertRule() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.POST)
                .apiPattern(ALERT_API_PREFIX)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.ADD_ALERT)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule updateAlertRule() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.PUT)
                .apiPattern(ALERT_API_PREFIX)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.EDIT_ALERT)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule deleteAlertRule() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.DELETE)
                .apiPattern(ALERT_API_PREFIX + ALERT_ID)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.DELETE_ALERT)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }
}
