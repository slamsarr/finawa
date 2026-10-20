package sn.finawa.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import sn.finawa.dto.administration.AdminJournalResponse;
import sn.finawa.entity.JournalEntity;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring")
public interface JournalMapper extends EntityMapper<AdminJournalResponse, JournalEntity> {
}
