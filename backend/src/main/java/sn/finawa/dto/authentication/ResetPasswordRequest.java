package sn.finawa.dto.authentication;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@JsonInclude(value = JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@Schema(name = "ResetPasswordRequest")
public class ResetPasswordRequest implements Serializable {

    @NotBlank(message = "Le jeton de réinitialisation est requis")
    private String token;

    @NotBlank(message = "Le mot de passe ne peut pas être vide")
    @Size(min = 8, max = 50, message = "Le mot de passe doit comporter entre 8 et 50 caractères")
    private String newPassword;
}
