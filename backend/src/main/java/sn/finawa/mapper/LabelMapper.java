package sn.finawa.mapper;

import org.mapstruct.*;
import sn.finawa.dto.LabelResponse;
import sn.finawa.entity.LabelEntity;
import sn.finawa.entity.enums.ReferentialType;
import sn.finawa.dto.helper.ReferentialResponse;


@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring")
public interface LabelMapper extends EntityMapper<LabelResponse, LabelEntity> {

    @Override
    @Mapping(source = "referentialType", target = "referential", qualifiedByName = "toRefDto")
    LabelResponse asDto(LabelEntity entity);

    @Named("toRefDto")
    default ReferentialResponse toRefDto(ReferentialType type){
        return ReferentialResponse.get(type);
    }

}
