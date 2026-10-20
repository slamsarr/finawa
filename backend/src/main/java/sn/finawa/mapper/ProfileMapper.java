package sn.finawa.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;
import sn.finawa.entity.ProfileEntity;
import sn.finawa.dto.helper.PermissionResponse;
import sn.finawa.dto.ProfileResponse;

import java.util.Collections;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring")
public interface ProfileMapper extends EntityMapper<ProfileResponse, ProfileEntity> {

    @Override
    @Mapping(target = "permissions", source = "permissions", qualifiedByName = "toPermissionDto")
    ProfileResponse asDto(ProfileEntity entity);

    @Override
    @Mapping(target = "permissions", source = "permissions", qualifiedByName = "toPermissions")
    ProfileEntity asEntity(ProfileResponse dto);

    @Named("toPermissionDto")
    default Set<PermissionResponse> toPermissionDto(Set<String> permissions) {
        if (Objects.isNull(permissions)) {
            return Collections.emptySet();
        }
        return permissions.stream().map(PermissionResponse::get).collect(Collectors.toSet());
    }

    @Named("toPermissions")
    default Set<String> toPermissions(Set<PermissionResponse> permissions) {
        if (Objects.isNull(permissions)) {
            return Collections.emptySet();
        }
        return permissions.stream().map(PermissionResponse::getType).collect(Collectors.toSet());
    }
}
