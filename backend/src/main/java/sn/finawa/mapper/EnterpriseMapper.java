package sn.finawa.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import sn.finawa.dto.EnterpriseResponse;
import sn.finawa.entity.EnterpriseEntity;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring", uses = {UserMapper.class})
public interface EnterpriseMapper extends EntityMapper<EnterpriseResponse, EnterpriseEntity> {

    EnterpriseResponse asDto(EnterpriseEntity entity);

}
