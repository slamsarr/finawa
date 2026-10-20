package sn.finawa.service;

import sn.finawa.dto.DossierCreateRequest;
import sn.finawa.dto.DossierResponse;
import sn.finawa.dto.DossierUpdateRequest;

import java.util.List;
import java.util.Map;

public interface DossierService {
    DossierResponse create(DossierCreateRequest request);
    DossierResponse update(DossierUpdateRequest request);
    DossierResponse read(Long id);
    DossierResponse readByReference(String reference);
    List<DossierResponse> readAll(Map<String, String> searchParams, org.springframework.data.domain.Pageable pageable);
    List<DossierResponse> readByEnterprise(Long enterpriseId);
    List<DossierResponse> readByStatus(String status);
    void delete(Long id);
    DossierResponse submit(Long id);
    DossierResponse updateStatus(Long id, String status);
    sn.finawa.service.cep.CepExportService.CepExportResult exportCep(Long id);
    DossierResponse saveFormData(Long id, sn.finawa.dto.form.DossierFormData formData, Boolean isDraft);
    sn.finawa.dto.form.DossierFormData getFormData(Long id);
    DossierResponse updateExpertNotes(Long id, String expertNotes);
}
