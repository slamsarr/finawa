package sn.finawa.security.rules;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import sn.finawa.entity.enums.SecurityPermissions;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DocumentRule {

    static final String DOCUMENT_API_PREFIX = "/documents";
    static final String DOCUMENT_ID = "/{documentId}";
    static final String DOWNLOAD_PREFIX = "/{id}/_download";
    static final String VIEW_PREFIX = "/{id}/_view";

    @Bean
    public SecurityRule viewDocument() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.GET)
                .apiPattern(DOCUMENT_API_PREFIX + VIEW_PREFIX)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.READ_DOCUMENT)
                .hasPermission(SecurityPermissions.READ_FILE_DOCUMENT)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule readFileDocument() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.GET)
                .apiPattern(DOCUMENT_API_PREFIX + DOWNLOAD_PREFIX)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.READ_DOCUMENT)
                .hasPermission(SecurityPermissions.READ_FILE_DOCUMENT)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule createDocument() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.POST)
                .apiPattern(DOCUMENT_API_PREFIX)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.ADD_DOCUMENT)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule readDocument() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.GET)
                .apiPattern(DOCUMENT_API_PREFIX + DOCUMENT_ID)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.READ_DOCUMENT)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule readAllDocument() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.GET)
                .apiPattern(DOCUMENT_API_PREFIX)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.READ_DOCUMENT)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule updateDocument() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.PATCH)
                .apiPattern(DOCUMENT_API_PREFIX + DOCUMENT_ID)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.EDIT_DOCUMENT)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule deleteDocument() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.DELETE)
                .apiPattern(DOCUMENT_API_PREFIX + DOCUMENT_ID)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.DELETE_DOCUMENT)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }
}
