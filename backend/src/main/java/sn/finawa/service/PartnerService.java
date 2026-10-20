package sn.finawa.service;

import sn.finawa.dto.PartnerCreateRequest;
import sn.finawa.dto.PartnerResponse;
import sn.finawa.dto.PartnerUpdateRequest;

import java.util.List;
import java.util.Map;

public interface PartnerService {
    PartnerResponse create(PartnerCreateRequest request);
    PartnerResponse update(PartnerUpdateRequest request);
    PartnerResponse read(Long id);
    PartnerResponse readByUser(Long userId);
    List<PartnerResponse> readAll(Map<String, String> searchParams, org.springframework.data.domain.Pageable pageable);
    List<PartnerResponse> readActive();
    List<PartnerResponse> readByType(String type);
    void delete(Long id);
    PartnerResponse activate(Long id);
    PartnerResponse deactivate(Long id);
}
