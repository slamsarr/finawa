package sn.finawa.service;

import org.springframework.stereotype.Service;
import sn.finawa.dto.administration.AdminJournalResponse;

@Service
public interface JournalService extends CRUDService<AdminJournalResponse> {
}
