package sn.finawa.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

// TODO : Change error responses/error messages to french
@Data
@Builder
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "Alert")
public class AlertResponse implements Serializable {

    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime date;

    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private boolean read;

    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private LabelResponse priority;

    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private String message;

    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private String user;

}
