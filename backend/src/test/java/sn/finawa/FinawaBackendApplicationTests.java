package sn.finawa;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import sn.finawa.configuration.TestSecurityConfiguration;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestSecurityConfiguration.class)
class FinawaBackendApplicationTests {

    @Test
    void contextLoads() {
    }
}
