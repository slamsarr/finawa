package sn.finawa.security;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.stereotype.Component;
import sn.finawa.security.rules.SecurityRule;

import java.util.List;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WebSecurityManager {

    // Collects all SecurityRule beans declared under package "security.rules"
    // They are automatically injected by spring.
    final List<SecurityRule> securityRules;

    public void manageSecurityRules(HttpSecurity http) throws Exception {
        for(SecurityRule securityRule : securityRules) {
            securityRule.configure(http);
        }
    }
}
