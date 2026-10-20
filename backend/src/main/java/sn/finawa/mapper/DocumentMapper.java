package sn.finawa.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import sn.finawa.dto.DocumentResponse;
import sn.finawa.entity.DocumentEntity;


@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring", uses = {UserMapper.class})
public interface DocumentMapper extends EntityMapper<DocumentResponse, DocumentEntity> {

    DocumentResponse asDto(DocumentEntity entity);

}
