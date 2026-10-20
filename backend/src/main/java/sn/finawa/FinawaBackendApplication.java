package sn.finawa;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;
import sn.finawa.entity.ProfileEntity;
import sn.finawa.entity.UserEntity;
import sn.finawa.entity.enums.SecurityPermissions;
import sn.finawa.repository.ProfileRepository;
import sn.finawa.repository.UserRepository;

import java.util.HashSet;
import java.util.Set;

@SpringBootApplication(scanBasePackages = "sn.finawa")
@EnableScheduling
@EnableAsync
@Slf4j
public class FinawaBackendApplication {

    @Autowired
    private PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(FinawaBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner seedAdminUser(UserRepository userRepository, ProfileRepository profileRepository) {
        return args -> {
            if (!userRepository.findAll().isEmpty() || !profileRepository.findAll().isEmpty()) {
                return;
            }
            Set<String> permissions = new HashSet<>();
            permissions.add(SecurityPermissions.ALL_ACCESS.name());
            ProfileEntity prof = profileRepository.save(ProfileEntity.builder()
                    .name("ADMINISTRATION")
                    .description("Profile des administrateurs")
                    .permissions(permissions)
                    .build());
            seedRequiredProfiles(profileRepository);

            userRepository.save(UserEntity.builder()
                    .profile(prof)
                    .login("admin@finawa.com")
                    .password(passwordEncoder.encode("admin-finawa@2026"))
                    .active(true)
                    .firstAttempt(false)
                    .build());
            log.info("Seeded default admin user (login: admin@finawa.com)");
        };
    }

    private void seedRequiredProfiles(ProfileRepository profileRepository) {
        profileRepository.save(ProfileEntity.builder()
                .name("ENTREPRISE")
                .description("Profile des entreprises")
                .permissions(new HashSet<>())
                .build());
        profileRepository.save(ProfileEntity.builder()
                .name("ANALYSTE")
                .description("Profile des analystes")
                .permissions(new HashSet<>())
                .build());
    }
}
