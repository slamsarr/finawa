package sn.finawa.security.rules;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.Singular;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.access.expression.WebExpressionAuthorizationManager;
import sn.finawa.entity.enums.SecurityPermissions;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SecurityRule {

    @NotNull
    HttpMethod httpMethod;

    @NotEmpty
    @Singular
    List<String> apiPatterns;

    @Builder.Default
    boolean authenticated = true;

    @Builder.Default
    List<Condition> conditions = new ArrayList<>();

    public void configure(HttpSecurity httpSecurity) throws Exception {
        String authenticationAccess = authenticated ? "isAuthenticated()" : null;

        // regroup all the formatted conditions into one string
        // e.g (hasAnyAuthority(T(sn.finawa.entities.enums.SecurityPermissions).READ_USER),
        //      hasAnyAuthority(T(sn.finawa.entities.enums.SecurityPermissions).WRITE_USER))
        // the "T()" means it evaluates at runtime the actual value of the enum's present in securityPermissions.
        String allConditions = conditions.stream()
                .map(Condition::toFormat)
                .filter(s -> s != null && !s.isEmpty())
                .collect(() -> new StringJoiner(" or ", "(", ")").setEmptyValue(""), StringJoiner::add, StringJoiner::merge)
                .toString();

        // then combine the conditions with the authentication factor to form SpEl for expression authorization.
        // e.g (isAuthenticated() and (hasAnyAuthority("READ_USER") or hasAnyAuthority("WRITE_USER")))
        String access = Arrays.stream(new String[]{authenticationAccess, allConditions})
                .filter(s -> s != null && !s.isEmpty())
                .collect(() -> new StringJoiner(" and ", "(", ")").setEmptyValue(""), StringJoiner::add, StringJoiner::merge)
                .toString();

        // if access is empty, then it means the attribute "authenticated" has been set to false
        // signaling us that we don't need authentication for this endpoint that's why we use "permitAll"
        if (access.isEmpty()) {
            log.trace("Configuring permitAll for {} {}", httpMethod, apiPatterns);
            httpSecurity.authorizeHttpRequests(auth -> auth
                    .requestMatchers(httpMethod, apiPatterns.toArray(new String[0]))
                    .permitAll());
        } else {
            log.trace("Configuring access {} for {} {}", access, httpMethod, apiPatterns);
            httpSecurity.authorizeHttpRequests(auth -> auth
                    .requestMatchers(httpMethod, apiPatterns.toArray(new String[0]))
                    .access(new WebExpressionAuthorizationManager(access)));
        }
    }

    public Condition condition() {
        Condition condition = new Condition(this);
        this.conditions.add(condition);
        return condition;
    }

    @RequiredArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class Condition {

        final Set<SecurityPermissions> permissions = new HashSet<>();
        String controlMethod;
        final SecurityRule securityRule;

        public Condition hasPermission(SecurityPermissions permission) {
            this.permissions.add(permission);
            return this;
        }

        public Condition controlMethod(String controlMethod) {
            this.controlMethod = controlMethod;
            return this;
        }

        public Condition or() {
            return securityRule.condition();
        }

        public SecurityRule end() {
            return securityRule;
        }

        // this just iterates through all the permissions for a given condition
        // then format them into a valid SpEl expression for
        private String toFormat() {
            StringJoiner result = new StringJoiner(" and ", "(", ")").setEmptyValue("");
            if (!this.permissions.isEmpty()) {
                String anyAuthorities = this.permissions.stream()
                        .map(r -> "T(" + SecurityPermissions.class.getName() + ")." + r.name())
                        .collect(Collectors.joining(","));
                result.add("hasAnyAuthority(" + anyAuthorities + ")");
            }
            if (controlMethod != null && !controlMethod.isEmpty()) {
                result.add(controlMethod);
            }
            return result.toString();
        }
    }
}
