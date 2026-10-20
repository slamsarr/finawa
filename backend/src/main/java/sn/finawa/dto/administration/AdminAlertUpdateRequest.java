package sn.finawa.dto.administration;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(name = "AlertUpdateRequest")
public class AdminAlertUpdateRequest implements  Serializable {

    @NotNull(message = "Cannot update alert with null id")
    private Long id;

    @NotBlank(message = "You cannot send an alert with an empty message")
    private String message;

    @NotNull(message = "A valid alert priority must be set")
    private Long priorityId;

    private boolean read;

}
