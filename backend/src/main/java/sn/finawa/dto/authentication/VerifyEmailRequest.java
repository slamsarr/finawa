package sn.finawa.dto.authentication;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "VerifyEmailRequest")
public class VerifyEmailRequest implements Serializable {

    @NotBlank(message = "Token cannot be blank")
    private String token;
}
