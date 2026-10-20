package sn.finawa.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sn.finawa.annotation.Journal;
import sn.finawa.dto.administration.AdminAlertCreateRequest;
import sn.finawa.dto.administration.AdminAlertUpdateRequest;
import sn.finawa.entity.AlertEntity;
import sn.finawa.entity.enums.ReferentialType;
import sn.finawa.exception.ResourceNotFoundException;
import sn.finawa.mapper.AlertMapper;
import sn.finawa.dto.AlertResponse;
import sn.finawa.repository.AlerteRepository;
import sn.finawa.repository.UserRepository;
import sn.finawa.service.AlertService;
import sn.finawa.utility.LabelResolver;
import sn.finawa.aspect.ActionType;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AlertServiceImpl implements AlertService {

    private final LabelResolver labelResolver;
    private final AlerteRepository alertRepository;
    private final AlertMapper alertMapper;
    private final UserRepository userRepository;

    private static final String USER_LOGIN_NOT_FOUND_MESSAGE = "User not found with login : ";
    private static final String ALERT_ID_NOT_FOUND_MESSAGE = "Alert not found with id : ";

    @Override
    @Journal(actionType = ActionType.ADD_ALERT)
    public AlertResponse create(AdminAlertCreateRequest dto) {
        var user = userRepository
                .findByLogin(dto.getUserLogin())
                .orElseThrow(() -> new ResourceNotFoundException(USER_LOGIN_NOT_FOUND_MESSAGE + dto.getUserLogin()));

        var priorityLabel = labelResolver.getLabel(dto.getPriorityId(), ReferentialType.ALERT_PRIORITY);

        var alert = AlertEntity
                .builder()
                .priority(priorityLabel)
                .user(user)
                .message(dto.getMessage())
                .read(false)
                .date(LocalDateTime.now())
                .build();
        return alertMapper.asDto(alertRepository.save(alert));
    }

    @Override
    @Journal(actionType = ActionType.UPDATE_ALERT)
    public AlertResponse update(AdminAlertUpdateRequest dto) {
        var alert = alertRepository
                .findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException(ALERT_ID_NOT_FOUND_MESSAGE + dto.getId()));
        var priorityLabel = labelResolver.getLabel(dto.getPriorityId(), ReferentialType.ALERT_PRIORITY);
        alert.setMessage(dto.getMessage());
        alert.setPriority(priorityLabel);
        return alertMapper.asDto(alertRepository.save(alert));
    }

    @Override
    @Journal(actionType = ActionType.READ_ALERT)
    public AlertResponse read(Long id) {
        var alert = alertRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ALERT_ID_NOT_FOUND_MESSAGE + id));
        return alertMapper.asDto(alert);
    }

    @Override
    @Journal(actionType = ActionType.READ_ALERT)
    public Page<AlertResponse> readAll(Map<String, String> searchParams, Pageable pageable) {
        return alertRepository
                .readAll(searchParams, pageable)
                .map(alertMapper::asDto);
    }

    @Override
    @Journal(actionType = ActionType.DELETE_ALERT)
    public void delete(Long id) {
        var alert = alertRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ALERT_ID_NOT_FOUND_MESSAGE + id));
        alertRepository.delete(alert);
    }

    @Override
    public AlertResponse markAsRead(Long id) {
        var alert = alertRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ALERT_ID_NOT_FOUND_MESSAGE + id));
        alert.setRead(true);
        return alertMapper.asDto(alertRepository.save(alert));
    }
}
