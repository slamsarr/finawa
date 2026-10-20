package sn.finawa.dto.administration;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;

@Data
@Builder
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@ToString
@JsonInclude(value = JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@Schema(name = "LabelCreateRequest")
public class AdminLabelCreateRequest implements Serializable {

    @NotBlank(message = "Label referential type cannot be blank")
    private String type;

    @NotBlank(message = "Label name cannot be blank")
    private String name;

    @NotBlank(message = "Label description cannot be blank")
    private String description;

}
