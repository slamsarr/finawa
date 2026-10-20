package sn.finawa.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import sn.finawa.dto.AlertResponse;
import sn.finawa.dto.administration.AdminAlertCreateRequest;
import sn.finawa.dto.administration.AdminAlertUpdateRequest;

import java.util.Map;

@Service
public interface AlertService {

    AlertResponse create(AdminAlertCreateRequest dto);

    AlertResponse update(AdminAlertUpdateRequest dto);

    AlertResponse read(Long id);

    Page<AlertResponse> readAll(Map<String, String> searchParams, Pageable pageable);

    void delete(Long id);

    AlertResponse markAsRead(Long id);
}
