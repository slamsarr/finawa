package sn.finawa.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import sn.finawa.dto.administration.AdminUserResponse;
import sn.finawa.entity.UserEntity;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR, componentModel = "spring", uses = {ProfileMapper.class})
public interface AdminUserMapper extends EntityMapper<AdminUserResponse, UserEntity> {
    @Override
    AdminUserResponse asDto(UserEntity userEntity);

    @Override
    @Mapping(target = "firstAttempt", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    UserEntity asEntity(AdminUserResponse UserDTO);

}

