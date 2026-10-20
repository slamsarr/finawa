package sn.finawa.security.rules;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import sn.finawa.entity.enums.SecurityPermissions;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DossierRule {
    static final String DOSSIER_API_PREFIX = "/dossiers";
    static final String DOSSIER_ID = "/{dossierId}";
    static final String REFERENCE = "/reference/{reference}";
    static final String ENTERPRISE = "/enterprise/{enterpriseId}";
    static final String STATUS = "/status/{status}";
    static final String SUBMIT = "/{dossierId}/submit";
    static final String UPDATE_STATUS = "/{dossierId}/status";
    static final String EXPORT_CEP = "/{dossierId}/export-cep";
    static final String FORM = "/{dossierId}/form";
    static final String EXPERT_NOTES = "/{dossierId}/expert-notes";

    @Bean
    public SecurityRule createDossier() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.POST)
                .apiPattern(DOSSIER_API_PREFIX)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.ADD_DOSSIER)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule readDossier() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.GET)
                .apiPattern(DOSSIER_API_PREFIX)
                .apiPattern(DOSSIER_API_PREFIX + DOSSIER_ID)
                .apiPattern(DOSSIER_API_PREFIX + REFERENCE)
                .apiPattern(DOSSIER_API_PREFIX + ENTERPRISE)
                .apiPattern(DOSSIER_API_PREFIX + STATUS)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.READ_DOSSIER)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule updateDossier() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.PUT)
                .apiPattern(DOSSIER_API_PREFIX)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.EDIT_DOSSIER)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule submitDossier() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.POST)
                .apiPattern(DOSSIER_API_PREFIX + SUBMIT)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.SUBMIT_DOSSIER)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule updateDossierStatus() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.PATCH)
                .apiPattern(DOSSIER_API_PREFIX + UPDATE_STATUS)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.EDIT_STATUS_DOSSIER)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule deleteDossier() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.DELETE)
                .apiPattern(DOSSIER_API_PREFIX + DOSSIER_ID)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.DELETE_DOSSIER)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule exportCepRule() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.GET)
                .apiPattern(DOSSIER_API_PREFIX + EXPORT_CEP)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.DOWNLOAD_CEP)
                .hasPermission(SecurityPermissions.READ_DOSSIER)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule dossierFormRule() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.POST)
                .apiPattern(DOSSIER_API_PREFIX + FORM)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.EDIT_DOSSIER)
                .hasPermission(SecurityPermissions.ADD_DOSSIER)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule getDossierFormRule() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.GET)
                .apiPattern(DOSSIER_API_PREFIX + FORM)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.READ_DOSSIER)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }

    @Bean
    public SecurityRule expertNotesRule() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.PATCH)
                .apiPattern(DOSSIER_API_PREFIX + EXPERT_NOTES)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.EDIT_DOSSIER)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }
}
