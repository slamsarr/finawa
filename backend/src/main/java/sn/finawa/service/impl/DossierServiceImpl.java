package sn.finawa.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sn.finawa.dto.DossierCreateRequest;
import sn.finawa.dto.DossierResponse;
import sn.finawa.dto.DossierUpdateRequest;
import sn.finawa.dto.form.DossierFormData;
import sn.finawa.dto.form.EnterpriseInfoDto;
import sn.finawa.dto.form.FinancialInfoDto;
import sn.finawa.dto.form.FinancingRequestDto;
import sn.finawa.entity.DocumentEntity;
import sn.finawa.entity.DossierEntity;
import sn.finawa.entity.EnterpriseEntity;
import sn.finawa.entity.LabelEntity;
import sn.finawa.exception.ForbiddenException;
import sn.finawa.exception.InternalError;
import sn.finawa.exception.ResourceNotFoundException;
import sn.finawa.mapper.DossierMapper;
import sn.finawa.repository.DocumentRepository;
import sn.finawa.repository.DossierRepository;
import sn.finawa.repository.EnterpriseRepository;
import sn.finawa.repository.LabelRepository;
import sn.finawa.security.SecurityUtils;
import sn.finawa.service.DossierService;
import sn.finawa.service.cep.CepExportService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class DossierServiceImpl implements DossierService {

    private final DossierRepository dossierRepository;
    private final EnterpriseRepository enterpriseRepository;
    private final LabelRepository labelRepository;
    private final DocumentRepository documentRepository;
    private final DossierMapper dossierMapper;
    private final CepExportService cepExportService;
    private final ObjectMapper objectMapper;

    @Override
    public DossierResponse create(DossierCreateRequest request) {
        EnterpriseEntity enterprise = null;
        if (request.getEnterpriseId() != null) {
            enterprise = enterpriseRepository.findById(request.getEnterpriseId()).orElse(null);
        }
        if (enterprise == null) {
            var currentUserLogin = SecurityUtils.getCurrentUserLogin().orElse(null);
            if (currentUserLogin != null) {
                enterprise = enterpriseRepository.findByUserLogin(currentUserLogin).orElse(null);
            }
        }
        if (enterprise == null) {
            enterprise = enterpriseRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Enterprise not found. Please create an enterprise profile first."));
        }

        LabelEntity needType = null;
        if (request.getNeedTypeId() != null) {
            needType = labelRepository.findById(request.getNeedTypeId()).orElse(null);
        }
        if (needType == null) {
            needType = labelRepository.findByReferentialType(sn.finawa.entity.enums.ReferentialType.NEED_TYPE)
                    .stream().findFirst().orElse(null);
        }

        DossierEntity entity = dossierMapper.toEntity(request);
        entity.setEnterprise(enterprise);
        entity.setNeedType(needType);
        entity.setReference(generateReference());
        entity.setIsDraft(Boolean.TRUE.equals(request.getIsDraft()));
        entity.setStatus(Boolean.TRUE.equals(request.getIsDraft()) ? "BROUILLON" : "EN_COURS");
        entity.setSubmissionDate(LocalDateTime.now());
        entity.setVersion(1);

        // Si des données structurées de formulaire sont fournies
        if (request.getFormData() != null) {
            syncFormDataWithEntity(request.getFormData(), entity);
            entity.setFormData(serializeFormData(request.getFormData()));
        }

        int score = calculateScore(entity, request.getFormData());
        entity.setScore(score);

        if (request.getCaValid() == null) entity.setCaValid(false);
        if (request.getNineaProvided() == null) entity.setNineaProvided(false);
        if (request.getGuaranteeComplete() == null) entity.setGuaranteeComplete(false);

        DossierEntity saved = dossierRepository.save(entity);
        return enrichResponse(dossierMapper.toResponse(saved), saved);
    }

    @Override
    public DossierResponse update(DossierUpdateRequest request) {
        DossierEntity entity = dossierRepository.findById(request.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Dossier not found"));

        if (request.getEnterpriseId() != null) {
            EnterpriseEntity enterprise = enterpriseRepository.findById(request.getEnterpriseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Enterprise not found"));
            entity.setEnterprise(enterprise);
        }

        if (request.getNeedTypeId() != null) {
            LabelEntity needType = labelRepository.findById(request.getNeedTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Need type not found"));
            entity.setNeedType(needType);
        }

        dossierMapper.updateEntityFromDto(request, entity);

        if (request.getIsDraft() != null) {
            entity.setIsDraft(request.getIsDraft());
        }
        if (request.getExpertNotes() != null) {
            entity.setExpertNotes(request.getExpertNotes());
        }
        if (request.getFormData() != null) {
            syncFormDataWithEntity(request.getFormData(), entity);
            entity.setFormData(serializeFormData(request.getFormData()));
            entity.setVersion(entity.getVersion() != null ? entity.getVersion() + 1 : 1);
        }

        DossierEntity saved = dossierRepository.save(entity);
        return enrichResponse(dossierMapper.toResponse(saved), saved);
    }

    @Override
    public DossierResponse read(Long id) {
        DossierEntity entity = dossierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dossier not found"));
        return enrichResponse(dossierMapper.toResponse(entity), entity);
    }

    @Override
    public DossierResponse readByReference(String reference) {
        DossierEntity entity = dossierRepository.findByReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException("Dossier not found"));
        return enrichResponse(dossierMapper.toResponse(entity), entity);
    }

    @Override
    public List<DossierResponse> readAll(Map<String, String> searchParams, Pageable pageable) {
        Page<DossierEntity> page = dossierRepository.findAll(pageable);
        return page.getContent().stream()
                .map(e -> enrichResponse(dossierMapper.toResponse(e), e))
                .toList();
    }

    @Override
    public List<DossierResponse> readByEnterprise(Long enterpriseId) {
        List<DossierEntity> entities = dossierRepository.findByEnterpriseId(enterpriseId);
        return entities.stream()
                .map(e -> enrichResponse(dossierMapper.toResponse(e), e))
                .toList();
    }

    @Override
    public List<DossierResponse> readByStatus(String status) {
        List<DossierEntity> entities = dossierRepository.findByStatus(status);
        return entities.stream()
                .map(e -> enrichResponse(dossierMapper.toResponse(e), e))
                .toList();
    }

    @Override
    public void delete(Long id) {
        if (!dossierRepository.existsById(id)) {
            throw new ResourceNotFoundException("Dossier not found");
        }
        dossierRepository.deleteById(id);
    }

    @Override
    public DossierResponse submit(Long id) {
        DossierEntity entity = dossierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dossier not found"));
        entity.setStatus("TRANSMIS");
        entity.setIsDraft(false);
        entity.setSubmissionDate(LocalDateTime.now());
        entity.setVersion(entity.getVersion() != null ? entity.getVersion() + 1 : 1);

        DossierEntity saved = dossierRepository.save(entity);
        return enrichResponse(dossierMapper.toResponse(saved), saved);
    }

    @Override
    public DossierResponse updateStatus(Long id, String status) {
        DossierEntity entity = dossierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dossier not found"));
        entity.setStatus(status);
        DossierEntity saved = dossierRepository.save(entity);
        return enrichResponse(dossierMapper.toResponse(saved), saved);
    }

    @Override
    public CepExportService.CepExportResult exportCep(Long id) {
        DossierEntity entity = dossierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dossier not found with ID: " + id));

        verifyAccess(entity);

        DossierFormData formData = deserializeFormData(entity.getFormData());
        if (formData == null) {
            formData = createDefaultFormDataFromEntity(entity);
        }

        // Collecter les documents fournis
        List<String> docNames = new ArrayList<>();
        if (entity.getEnterprise() != null && entity.getEnterprise().getUser() != null) {
            List<DocumentEntity> docs = documentRepository.findAll().stream()
                    .filter(d -> d.getOwner() != null && d.getOwner().getId().equals(entity.getEnterprise().getUser().getId()))
                    .toList();
            for (DocumentEntity d : docs) {
                if (d.getName() != null) docNames.add(d.getName());
                if (d.getDocumentType() != null && d.getDocumentType().getName() != null) {
                    docNames.add(d.getDocumentType().getName());
                }
            }
        }

        CepExportService.CepExportResult result = cepExportService.exportCep(entity, formData, docNames);

        entity.setLastExportedAt(LocalDateTime.now());
        dossierRepository.save(entity);

        return result;
    }

    @Override
    public DossierResponse saveFormData(Long id, DossierFormData formData, Boolean isDraft) {
        DossierEntity entity = dossierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dossier not found with ID: " + id));

        verifyAccess(entity);

        boolean draft = Boolean.TRUE.equals(isDraft);
        entity.setIsDraft(draft);
        if (!draft && !"TRANSMIS".equals(entity.getStatus())) {
            entity.setStatus("TRANSMIS");
            entity.setSubmissionDate(LocalDateTime.now());
        }

        syncFormDataWithEntity(formData, entity);
        entity.setFormData(serializeFormData(formData));
        entity.setScore(calculateScore(entity, formData));
        entity.setVersion(entity.getVersion() != null ? entity.getVersion() + 1 : 1);

        DossierEntity saved = dossierRepository.save(entity);
        return enrichResponse(dossierMapper.toResponse(saved), saved);
    }

    @Override
    public DossierFormData getFormData(Long id) {
        DossierEntity entity = dossierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dossier not found with ID: " + id));

        verifyAccess(entity);

        DossierFormData data = deserializeFormData(entity.getFormData());
        if (data == null) {
            data = createDefaultFormDataFromEntity(entity);
        }
        calculateCompleteness(data);
        return data;
    }

    @Override
    public DossierResponse updateExpertNotes(Long id, String expertNotes) {
        DossierEntity entity = dossierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dossier not found with ID: " + id));
        entity.setExpertNotes(expertNotes);
        DossierEntity saved = dossierRepository.save(entity);
        return enrichResponse(dossierMapper.toResponse(saved), saved);
    }

    // =========================================================================
    // HELPER METHODS
    // =========================================================================

    private void verifyAccess(DossierEntity entity) {
        var userLoginOpt = SecurityUtils.getCurrentUserLogin();
        if (userLoginOpt.isEmpty()) {
            return; // Contexte système ou test
        }
        String currentLogin = userLoginOpt.get();

        // Si l'utilisateur est le propriétaire de l'entreprise associée
        if (entity.getEnterprise() != null && entity.getEnterprise().getUser() != null) {
            if (currentLogin.equalsIgnoreCase(entity.getEnterprise().getUser().getLogin())) {
                return;
            }
        }

        // Si l'utilisateur a le profil Expert, Analyste ou Admin
        // Pour les experts et analystes, Finawa autorise l'accès à tous les dossiers préqualifiés ou assignés
        // Si besoin de restriction supplémentaire sur les assignations, elle s'applique ici.
    }

    private void syncFormDataWithEntity(DossierFormData form, DossierEntity entity) {
        if (form.getFinancing() != null) {
            FinancingRequestDto fin = form.getFinancing();
            if (fin.getDesiredAmount() != null && fin.getDesiredAmount().compareTo(BigDecimal.ZERO) > 0) {
                entity.setAmount(fin.getDesiredAmount());
            }
            if (fin.getDurationMonths() != null && fin.getDurationMonths() > 0) {
                entity.setDurationMonths(fin.getDurationMonths());
            }
            if (fin.getPurpose() != null && !fin.getPurpose().isBlank()) {
                entity.setPurpose(fin.getPurpose());
            }
        }

        if (form.getEnterprise() != null) {
            EnterpriseInfoDto ent = form.getEnterprise();
            if (ent.getNinea() != null && !ent.getNinea().isBlank()) {
                entity.setNineaProvided(true);
            }
            if (ent.getRccm() != null && !ent.getRccm().isBlank()) {
                entity.setCaValid(true);
            }
            if (entity.getEnterprise() != null) {
                EnterpriseEntity enterprise = entity.getEnterprise();
                if (ent.getLegalName() != null && !ent.getLegalName().isBlank()) {
                    enterprise.setName(ent.getLegalName());
                }
                if (ent.getEmployees() != null) {
                    enterprise.setEmployeeCount(ent.getEmployees());
                }
                if (ent.getCity() != null) {
                    enterprise.setRegion(ent.getCity());
                }
            }
        }

        if (form.getFinancial() != null) {
            FinancialInfoDto fi = form.getFinancial();
            if (fi.getCurrentYearEstimatedTurnover() != null && entity.getEnterprise() != null) {
                entity.getEnterprise().setAnnualTurnover(fi.getCurrentYearEstimatedTurnover().longValue());
            } else if (fi.getLastYearTurnover() != null && entity.getEnterprise() != null) {
                entity.getEnterprise().setAnnualTurnover(fi.getLastYearTurnover().longValue());
            }
        }
    }

    private int calculateScore(DossierEntity entity, DossierFormData form) {
        int score = 60;
        if (Boolean.TRUE.equals(entity.getCaValid())) score += 8;
        if (Boolean.TRUE.equals(entity.getNineaProvided())) score += 8;
        if (Boolean.TRUE.equals(entity.getGuaranteeComplete())) score += 8;

        if (form != null) {
            if (form.getShareholders() != null && !form.getShareholders().isEmpty()) score += 5;
            if (form.getBankRelations() != null && !form.getBankRelations().isEmpty()) score += 5;
            if (form.getFinancial() != null && "OUI".equalsIgnoreCase(form.getFinancial().getCertifiedStatements())) score += 6;
        }

        return Math.min(score, 95);
    }

    private void calculateCompleteness(DossierFormData data) {
        List<String> missing = new ArrayList<>();
        int totalPoints = 10;
        int acquiredPoints = 0;

        EnterpriseInfoDto ent = data.getEnterprise();
        if (ent.getLegalName() != null && !ent.getLegalName().isBlank()) acquiredPoints++;
        else missing.add("Nom de l'entreprise (Section A)");

        if (ent.getNinea() != null && !ent.getNinea().isBlank()) acquiredPoints++;
        else missing.add("NINEA (Section A)");

        if (ent.getManagerName() != null && !ent.getManagerName().isBlank()) acquiredPoints++;
        else missing.add("Nom du dirigeant (Section A)");

        FinancingRequestDto fin = data.getFinancing();
        if (fin.getDesiredAmount() != null && fin.getDesiredAmount().compareTo(BigDecimal.ZERO) > 0) acquiredPoints++;
        else missing.add("Montant souhaité (Section B)");

        if (fin.getPurpose() != null && !fin.getPurpose().isBlank()) acquiredPoints++;
        else missing.add("Objet du financement (Section B)");

        FinancialInfoDto fi = data.getFinancial();
        if (fi.getLastYearTurnover() != null || fi.getCurrentYearEstimatedTurnover() != null) acquiredPoints++;
        else missing.add("Chiffre d'affaires (Section C)");

        if (data.getShareholders() != null && !data.getShareholders().isEmpty()) acquiredPoints++;
        else missing.add("Au moins un actionnaire (Section D)");

        if (data.getBankRelations() != null && !data.getBankRelations().isEmpty()) acquiredPoints++;
        else missing.add("Au moins une relation bancaire (Section F)");

        if (data.getHistory() != null && !data.getHistory().isBlank()) acquiredPoints++;
        else missing.add("Historique de l'entreprise (Section E)");

        if (data.getConsent() != null && Boolean.TRUE.equals(data.getConsent().getCertifiedExact())) acquiredPoints++;
        else missing.add("Confirmation d'exactitude (Section H)");

        data.setMissingRequiredFields(missing);
        data.setCompletenessPercentage((acquiredPoints * 100) / totalPoints);
    }

    private DossierFormData createDefaultFormDataFromEntity(DossierEntity entity) {
        DossierFormData form = new DossierFormData();
        if (entity.getEnterprise() != null) {
            EnterpriseEntity e = entity.getEnterprise();
            form.getEnterprise().setLegalName(e.getName());
            form.getEnterprise().setCity(e.getRegion());
            form.getEnterprise().setCityZone(e.getRegion());
            form.getEnterprise().setEmployees(e.getEmployeeCount());
            if (e.getType() != null) form.getEnterprise().setLegalForm(e.getType().getName());
            if (e.getSector() != null) form.getEnterprise().setSector(e.getSector().getName());
            if (e.getAnnualTurnover() != null) {
                form.getFinancial().setCurrentYearEstimatedTurnover(BigDecimal.valueOf(e.getAnnualTurnover()));
            }
            if (e.getUser() != null) {
                form.getEnterprise().setEmail(e.getUser().getLogin());
            }
        }
        if (entity.getAmount() != null) {
            form.getFinancing().setDesiredAmount(entity.getAmount());
            form.getFinancing().setExactAmount(entity.getAmount());
        }
        if (entity.getDurationMonths() != null) {
            form.getFinancing().setDurationMonths(entity.getDurationMonths());
        }
        if (entity.getPurpose() != null) {
            form.getFinancing().setPurpose(entity.getPurpose());
        }
        if (entity.getNeedType() != null) {
            form.getFinancing().setNeedType(entity.getNeedType().getName());
        }
        return form;
    }

    private String serializeFormData(DossierFormData formData) {
        if (formData == null) return null;
        try {
            return objectMapper.writeValueAsString(formData);
        } catch (JsonProcessingException e) {
            log.error("Erreur de sérialisation JSON formData", e);
            throw new InternalError("Erreur lors de l'enregistrement des données du formulaire.");
        }
    }

    private DossierFormData deserializeFormData(String json) {
        if (json == null || json.isBlank()) return null;
        try {
            return objectMapper.readValue(json, DossierFormData.class);
        } catch (JsonProcessingException e) {
            log.warn("Erreur de désérialisation JSON formData: {}", e.getMessage());
            return null;
        }
    }

    private String generateReference() {
        return "DOS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private DossierResponse enrichResponse(DossierResponse response, DossierEntity entity) {
        if (response.getEnterpriseId() != null) {
            enterpriseRepository.findById(response.getEnterpriseId()).ifPresent(e -> {
                response.setEnterpriseName(e.getName());
            });
        }
        if (response.getNeedTypeId() != null) {
            labelRepository.findById(response.getNeedTypeId()).ifPresent(l -> {
                response.setNeedTypeName(l.getName());
            });
        }
        if (entity != null) {
            response.setIsDraft(entity.getIsDraft());
            response.setLastExportedAt(entity.getLastExportedAt());
            response.setExpertNotes(entity.getExpertNotes());
            response.setVersion(entity.getVersion());
            if (entity.getFormData() != null) {
                DossierFormData form = deserializeFormData(entity.getFormData());
                if (form != null) {
                    calculateCompleteness(form);
                    response.setFormData(form);
                }
            }
        }
        return response;
    }
}
