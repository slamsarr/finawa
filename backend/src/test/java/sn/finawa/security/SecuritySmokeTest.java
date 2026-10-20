package sn.finawa.security;
 
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import sn.finawa.configuration.TestSecurityConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import sn.finawa.security.services.JWTService;
 
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
 
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestSecurityConfiguration.class)
class SecuritySmokeTest {
 
    @Autowired
    private MockMvc mockMvc;
 
    @Autowired
    private JWTService jwtService;
 
    @Test
    void swaggerDocsArePublic() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk());
    }
 
    @Test
    void jwtComponentsAreLoaded() {
        assertThat(jwtService).isNotNull();
    }
}
