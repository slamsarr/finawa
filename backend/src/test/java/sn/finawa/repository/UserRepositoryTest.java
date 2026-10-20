package sn.finawa.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import sn.finawa.entity.ProfileEntity;
import sn.finawa.entity.UserEntity;

import org.springframework.context.annotation.Import;
import sn.finawa.configuration.TestSecurityConfiguration;

import static org.assertj.core.api.Assertions.assertThat;
 
@DataJpaTest
@ActiveProfiles("test")
@Import(TestSecurityConfiguration.class)
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Test
    void saveAndFindByLogin() {
        ProfileEntity profile = profileRepository.save(ProfileEntity.builder()
                .name("TEST")
                .description("Test profile")
                .permissions(java.util.Set.of("READ_USER"))
                .build());

        userRepository.save(UserEntity.builder()
                .login("testuser")
                .password("encoded")
                .active(true)
                .firstAttempt(false)
                .profile(profile)
                .build());

        assertThat(userRepository.findByLogin("testuser")).isPresent();
    }
}
