package sn.finawa.dto;

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
@Schema(name = "DocumentUpdateRequest")
public class DocumentUpdateRequest implements Serializable {

    @NotNull(message = "Document id cannot be null")
    private Long id;

    @NotBlank(message = "Document name cannot be blank")
    private String name;

    @NotNull(message = "Document description cannot be null")
    private String description;

    @NotNull(message = "Document type cannot be null")
    private Long documentTypeId;

}
