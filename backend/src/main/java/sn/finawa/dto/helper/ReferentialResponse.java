package sn.finawa.dto.helper;

import sn.finawa.entity.enums.ReferentialType;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import lombok.experimental.Accessors;

import java.util.Arrays;
import java.util.List;


@Data
@Builder
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "Referential")
public class ReferentialResponse {
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String type;
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String label;
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String description;


    static public List<ReferentialResponse> getAll() {
        return Arrays.stream(ReferentialType.values())
                .map((type) -> new ReferentialResponse(type.name(), type.getLabel(), type.getDescription()))
                .toList();
    }

    static public ReferentialResponse get(String type) {
        var ref = Arrays.stream(ReferentialType.values())
                .filter((refType) -> refType.name().equals(type))
                .findAny();
        if (ref.isEmpty()) {
            return null;
        }
        var value = ref.get();
        return ReferentialResponse
                .builder()
                .type(value.name())
                .label(value.getLabel())
                .description(value.getDescription())
                .build();
    }

    static public ReferentialResponse get(ReferentialType type) {
        return ReferentialResponse
                .builder()
                .type(type.name())
                .label(type.getLabel())
                .description(type.getDescription())
                .build();
    }
}
