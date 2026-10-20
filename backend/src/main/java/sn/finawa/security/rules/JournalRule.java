package sn.finawa.security.rules;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import sn.finawa.entity.enums.SecurityPermissions;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JournalRule {
    static final String JOURNAL_API_PREFIX = "/journals";
    static final String JOURNAL_ID = "/{journalId}";

    @Bean
    public SecurityRule readJournal() {
        return SecurityRule.builder()
                .httpMethod(HttpMethod.GET)
                .apiPattern(JOURNAL_API_PREFIX)
                .apiPattern(JOURNAL_API_PREFIX + JOURNAL_ID)
                .build()
                .condition()
                .hasPermission(SecurityPermissions.READ_LOG)
                .hasPermission(SecurityPermissions.ALL_ACCESS)
                .end();
    }


}
