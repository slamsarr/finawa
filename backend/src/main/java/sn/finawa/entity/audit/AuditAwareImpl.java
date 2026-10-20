package sn.finawa.entity.audit;

import org.springframework.data.domain.AuditorAware;
import sn.finawa.security.SecurityUtils;

import java.util.Optional;


//@Component
public class AuditAwareImpl implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        return SecurityUtils.getCurrentUserLogin();
    }
}
