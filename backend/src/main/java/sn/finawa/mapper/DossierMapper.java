package sn.finawa.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import sn.finawa.dto.DossierCreateRequest;
import sn.finawa.dto.DossierResponse;
import sn.finawa.dto.DossierUpdateRequest;
import sn.finawa.entity.DossierEntity;

@Mapper(componentModel = "spring")
public interface DossierMapper {

    @Mapping(target = "enterprise", ignore = true)
    @Mapping(target = "needType", ignore = true)
    @Mapping(target = "formData", ignore = true)
    DossierEntity toEntity(DossierCreateRequest request);

    @Mapping(source = "enterprise.id", target = "enterpriseId")
    @Mapping(source = "enterprise.name", target = "enterpriseName")
    @Mapping(source = "needType.id", target = "needTypeId")
    @Mapping(source = "needType.name", target = "needTypeName")
    @Mapping(target = "formData", ignore = true)
    DossierResponse toResponse(DossierEntity entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "formData", ignore = true)
    void updateEntityFromDto(DossierUpdateRequest request, @MappingTarget DossierEntity entity);
}
