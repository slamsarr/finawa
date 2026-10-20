package sn.finawa.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import sn.finawa.dto.MatchingResponse;
import sn.finawa.entity.MatchingEntity;

@Mapper(componentModel = "spring")
public interface MatchingMapper {

    @Mapping(source = "dossier.id", target = "dossierId")
    @Mapping(source = "dossier.reference", target = "dossierReference")
    @Mapping(source = "partner.id", target = "partnerId")
    @Mapping(source = "partner.name", target = "partnerName")
    MatchingResponse toResponse(MatchingEntity entity);
}
