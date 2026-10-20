package sn.finawa.dto.helper;

import sn.finawa.entity.enums.SecurityPermissions;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.util.Arrays;
import java.util.List;

@Data
@Builder
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "Permission")
public class PermissionResponse {

    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String type;

    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String description;

    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private FeatureResponse feature;

    static public List<PermissionResponse> getAll() {
        return Arrays.stream(SecurityPermissions.values())
                .map((type) -> new PermissionResponse(type.name(), type.getDescription(), FeatureResponse.get(type.getFeature())))
                .toList();
    }

    static public List<PermissionResponse> getByFeature(String name) {
        return Arrays.stream(SecurityPermissions.values())
                .filter((type) -> type.getFeature().name().equals(name))
                .map((type) -> new PermissionResponse(type.name(), type.getDescription(), FeatureResponse.get(type.getFeature())))
                .toList();
    }

    static public PermissionResponse get(String type) {
        var ref = Arrays.stream(SecurityPermissions.values())
                .filter((refType) -> refType.name().equals(type))
                .findAny();
        if (ref.isEmpty()) {
            return null;
        }
        var value = ref.get();
        return PermissionResponse
                .builder()
                .type(value.name())
                .description(value.getDescription())
                .feature(FeatureResponse.get(value.getFeature()))
                .build();
    }

    static public PermissionResponse get(SecurityPermissions permissions) {
        return PermissionResponse
                .builder()
                .type(permissions.name())
                .description(permissions.getDescription())
                .feature(FeatureResponse.get(permissions.getFeature()))
                .build();
    }
}
