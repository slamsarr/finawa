package sn.finawa.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import sn.finawa.dto.PartnerCreateRequest;
import sn.finawa.dto.PartnerResponse;
import sn.finawa.dto.PartnerUpdateRequest;
import sn.finawa.entity.PartnerEntity;

@Mapper(componentModel = "spring")
public interface PartnerMapper {

    PartnerEntity toEntity(PartnerCreateRequest request);

    PartnerResponse toResponse(PartnerEntity entity);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDto(PartnerUpdateRequest request, @MappingTarget PartnerEntity entity);
}
