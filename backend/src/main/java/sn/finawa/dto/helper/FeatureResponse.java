package sn.finawa.dto.helper;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import sn.finawa.entity.enums.Feature;

import java.util.Arrays;
import java.util.List;

@Data
@Builder
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "Feature")
public class FeatureResponse {

    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String type;

    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String description;

    static public List<FeatureResponse> getAll() {
        return Arrays.stream(Feature.values())
                .map((type) -> new FeatureResponse(type.name(), type.getDescription()))
                .toList();
    }

    static public FeatureResponse get(String type) {
        var ref = Arrays.stream(Feature.values())
                .filter((refType) -> refType.name().equals(type))
                .findAny();
        if (ref.isEmpty()) {
            return null;
        }
        var value = ref.get();
        return FeatureResponse
                .builder()
                .type(value.name())
                .description(value.getDescription())
                .build();
    }

    static public FeatureResponse get(Feature feature) {
        return FeatureResponse
                .builder()
                .type(feature.name())
                .description(feature.getDescription())
                .build();
    }
}
