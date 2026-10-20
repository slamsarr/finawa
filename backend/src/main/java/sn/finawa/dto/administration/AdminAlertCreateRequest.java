package sn.finawa.dto.administration;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;

@Data
@Builder
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "AlertCreateRequest")
public class AdminAlertCreateRequest implements Serializable {

    @NotBlank(message = "You cannot send an alert with an empty message")
    private String message;

    @Email(message = "Invalid email structure")
    private String userLogin;

    @NotNull(message = "A valid alert priority must be set")
    private Long priorityId;

}
