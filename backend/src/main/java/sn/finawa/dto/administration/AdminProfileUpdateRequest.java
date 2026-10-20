package sn.finawa.dto.administration;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.Accessors;

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
@Schema(name = "ProfileUpdateRequest")
public class AdminProfileUpdateRequest {

    @NotNull(message = "Profile id cannot be null")
    private Long id;

    @NotBlank(message = "Profile name cannot be blank")
    private String name;
    @NotBlank(message = "Profile description cannot be blank")
    private String description;

    private List<String> permissionNames = new ArrayList<>();
}
