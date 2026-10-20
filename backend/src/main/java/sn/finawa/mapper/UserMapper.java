package sn.finawa.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import sn.finawa.entity.UserEntity;
import sn.finawa.dto.UserResponse;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR, componentModel = "spring", uses = {ProfileMapper.class})
public interface UserMapper extends EntityMapper<UserResponse, UserEntity> {
    @Override
    UserResponse asDto(UserEntity userEntity);

    @Override
    @Mapping(target = "firstAttempt", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    UserEntity asEntity(UserResponse UserDTO);

}

