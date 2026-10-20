package sn.finawa.dto.administration;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@ToString
@JsonInclude(value = JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@Schema(name = "ProfileCreateRequest")
public class AdminProfileCreateRequest implements Serializable {

    @NotBlank(message = "Profile name cannot be blank")
    private String name;
    @NotBlank(message = "Profile description cannot be blank")
    private String description;

    private List<String> permissionNames = new ArrayList<>();
}
