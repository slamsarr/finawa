package sn.finawa.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.experimental.UtilityClass;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Optional;

@UtilityClass
public class SecurityUtils {

    public UserDetails getUserDetails(Authentication auth) {
        if (auth == null) {
            return null;
        }
        if (auth.getPrincipal() instanceof UserDetails) {
            return (UserDetails) auth.getPrincipal();
        }
        return null;
    }

    public Optional<String> getCurrentUserLogin() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        var user = getUserDetails(auth);
        if (user != null) {
            return Optional.of(user.getUsername());
        }
        return Optional.empty();
    }

    public String extractRefreshToken(HttpServletRequest request) {
        var cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }
        for (Cookie cookie : request.getCookies()) {
            if ("refreshToken".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
