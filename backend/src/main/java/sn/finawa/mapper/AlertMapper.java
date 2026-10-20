package sn.finawa.mapper;

import org.mapstruct.*;
import sn.finawa.dto.AlertResponse;
import sn.finawa.entity.AlertEntity;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring", uses = {UserMapper.class})
public interface AlertMapper extends EntityMapper<AlertResponse, AlertEntity> {

    @Mapping(source = "user.login", target = "user")
    AlertResponse asDto(AlertEntity entity);

    @Mapping(target = "user", ignore = true)
    AlertEntity asEntity(AlertResponse entity);
}
