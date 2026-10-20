package sn.finawa.security.rules;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import sn.finawa.entity.enums.SecurityPermissions;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LabelRule {
    static final String LABEL_API_PREFIX = "/labels";
    static final String LABEL_ID = "/{labelId}";
    static final String LABEL_REFS = "/refs";

    @Bean
    public SecurityRule createLabel() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.POST)
                .apiPattern(LABEL_API_PREFIX)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.ADD_LABEL)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }


    @Bean
    public SecurityRule updateLabel() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.PATCH)
                .apiPattern(LABEL_API_PREFIX + LABEL_ID)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.EDIT_LABEL)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule deleteLabel() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.DELETE)
                .apiPattern(LABEL_API_PREFIX + LABEL_ID)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.DELETE_LABEL)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule readLabel() {
        return SecurityRule.builder()
                .authenticated(false)
                .httpMethod(HttpMethod.GET)
                .apiPattern(LABEL_API_PREFIX + LABEL_ID)
                .apiPattern(LABEL_API_PREFIX)
                .build();
    }

    @Bean
    public SecurityRule readLabelReferential() {
        return SecurityRule.builder()
                .authenticated(false)
                .httpMethod(HttpMethod.GET)
                .apiPattern(LABEL_API_PREFIX + LABEL_REFS)
                .build();
    }
}
