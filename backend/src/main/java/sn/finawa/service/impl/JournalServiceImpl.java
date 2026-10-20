package sn.finawa.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sn.finawa.annotation.Journal;
import sn.finawa.dto.administration.AdminJournalResponse;
import sn.finawa.exception.ResourceNotFoundException;
import sn.finawa.mapper.JournalMapper;
import sn.finawa.repository.JournalRepository;
import sn.finawa.service.JournalService;
import sn.finawa.aspect.ActionType;

import java.util.Map;


@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class JournalServiceImpl implements JournalService {

    private final JournalRepository journalRepository;
    private final JournalMapper journalMapper;

    private static final String JOURNAL_ID_NOT_FOUND_MESSAGE = "Journal not found with id : ";

    @Override
    public AdminJournalResponse create(AdminJournalResponse dto) {
        return null;
    }

    @Override
    public AdminJournalResponse update(AdminJournalResponse dto) {
        return null;
    }

    @Override
    @Journal(actionType = ActionType.READ_LOG)
    public AdminJournalResponse read(Long id) {
        var journal = journalRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(JOURNAL_ID_NOT_FOUND_MESSAGE + id));
        return journalMapper.asDto(journal);
    }

    @Override
    @Journal(actionType = ActionType.READ_LOG)
    public Page<AdminJournalResponse> readAll(Map<String, String> searchParams, Pageable pageable) {
        return journalRepository
                .readAll(searchParams, pageable)
                .map(journalMapper::asDto);
    }

    @Override
    public void delete(Long id) {
    }
}
