package sn.finawa.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import sn.finawa.dto.LabelResponse;
import sn.finawa.dto.administration.AdminLabelCreateRequest;
import sn.finawa.dto.administration.AdminLabelUpdateRequest;

import java.util.Map;

@Service
public interface LabelService {

    LabelResponse create(AdminLabelCreateRequest dto);

    LabelResponse update(AdminLabelUpdateRequest dto);

    LabelResponse read(Long id);

    Page<LabelResponse> readAll(Map<String, String> searchParams, Pageable pageable);

    void delete(Long id);
}
