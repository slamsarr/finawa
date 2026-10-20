package sn.finawa.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sn.finawa.dto.EnterpriseCreateRequest;
import sn.finawa.dto.EnterpriseResponse;
import sn.finawa.dto.EnterpriseUpdateRequest;

import java.util.Map;

public interface EnterpriseService {
    EnterpriseResponse create(EnterpriseCreateRequest dto);

    EnterpriseResponse update(EnterpriseUpdateRequest dto);

    EnterpriseResponse readMyEnterprise();

    EnterpriseResponse updateMyEnterprise(EnterpriseUpdateRequest dto);

    EnterpriseResponse read(Long id);

    Page<EnterpriseResponse> readAll(Map<String, String> searchParams, Pageable pageable);

    void delete(Long id);
}
