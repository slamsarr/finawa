package sn.finawa.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sn.finawa.dto.MatchingResponse;
import sn.finawa.entity.DossierEntity;
import sn.finawa.entity.EnterpriseEntity;
import sn.finawa.entity.LabelEntity;
import sn.finawa.entity.MatchingEntity;
import sn.finawa.entity.PartnerEntity;
import sn.finawa.exception.ResourceNotFoundException;
import sn.finawa.mapper.MatchingMapper;
import sn.finawa.repository.DossierRepository;
import sn.finawa.repository.MatchingRepository;
import sn.finawa.repository.PartnerRepository;
import sn.finawa.service.MatchingService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class MatchingServiceImpl implements MatchingService {

    private final MatchingRepository matchingRepository;
    private final DossierRepository dossierRepository;
    private final PartnerRepository partnerRepository;
    private final MatchingMapper matchingMapper;

    @Override
    public List<MatchingResponse> runMatching(Long dossierId) {
        DossierEntity dossier = dossierRepository.findById(dossierId)
                .orElseThrow(() -> new ResourceNotFoundException("Dossier not found"));

        EnterpriseEntity enterprise = dossier.getEnterprise();
        if (enterprise == null) {
            throw new ResourceNotFoundException("Enterprise not found for dossier");
        }

        List<PartnerEntity> activePartners = partnerRepository.findByActiveTrue();
        List<MatchingEntity> matchings = new ArrayList<>();

        for (PartnerEntity partner : activePartners) {
            MatchingEntity matching = calculateMatching(dossier, partner);
            if (matching.getScore().compareTo(BigDecimal.valueOf(30)) >= 0) {
                matchings.add(matching);
            }
        }

        matchingRepository.deleteByDossierId(dossierId);
        List<MatchingEntity> saved = matchingRepository.saveAll(matchings);

        return saved.stream()
                .map(matchingMapper::toResponse)
                .map(this::enrichResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MatchingResponse> getMatchingForDossier(Long dossierId) {
        List<MatchingEntity> entities = matchingRepository.findByDossierIdOrderByScoreDesc(dossierId);
        return entities.stream()
                .map(matchingMapper::toResponse)
                .map(this::enrichResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MatchingResponse> getMatchingForPartner(Long partnerId) {
        List<MatchingEntity> entities = matchingRepository.findByPartnerId(partnerId);
        return entities.stream()
                .map(matchingMapper::toResponse)
                .map(this::enrichResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MatchingResponse updateStatus(Long matchingId, String status) {
        MatchingEntity entity = matchingRepository.findById(matchingId)
                .orElseThrow(() -> new ResourceNotFoundException("Matching not found"));
        entity.setStatus(status);
        MatchingEntity saved = matchingRepository.save(entity);
        return enrichResponse(matchingMapper.toResponse(saved));
    }

    @Override
    public void delete(Long matchingId) {
        if (!matchingRepository.existsById(matchingId)) {
            throw new ResourceNotFoundException("Matching not found");
        }
        matchingRepository.deleteById(matchingId);
    }

    @Override
    public void clearForDossier(Long dossierId) {
        matchingRepository.deleteByDossierId(dossierId);
    }

    private MatchingEntity calculateMatching(DossierEntity dossier, PartnerEntity partner) {
        MatchingEntity matching = MatchingEntity.builder()
                .dossier(dossier)
                .partner(partner)
                .matchDate(LocalDateTime.now())
                .status("PENDING")
                .build();

        BigDecimal score = BigDecimal.ZERO;
        int criteriaCount = 0;

        matching.setAmountSuitable(checkAmountSuitability(dossier.getAmount(), partner));
        if (matching.getAmountSuitable()) {
            score = score.add(BigDecimal.valueOf(25));
        }
        criteriaCount++;

        matching.setDurationSuitable(checkDurationSuitability(dossier.getDurationMonths(), partner));
        if (matching.getDurationSuitable()) {
            score = score.add(BigDecimal.valueOf(20));
        }
        criteriaCount++;

        matching.setSectorSuitable(checkSectorSuitability(dossier.getEnterprise().getSector(), partner.getSectors()));
        if (matching.getSectorSuitable()) {
            score = score.add(BigDecimal.valueOf(30));
        }
        criteriaCount++;

        matching.setZoneSuitable(checkZoneSuitability(dossier.getEnterprise().getRegion(), partner.getZones()));
        if (matching.getZoneSuitable()) {
            score = score.add(BigDecimal.valueOf(25));
        }
        criteriaCount++;

        matching.setScore(score.divide(BigDecimal.valueOf(criteriaCount * 25), 2, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)));

        StringBuilder notes = new StringBuilder();
        if (matching.getAmountSuitable()) notes.append("Montant compatible. ");
        else notes.append("Montant hors plage. ");
        if (matching.getDurationSuitable()) notes.append("Durée compatible. ");
        else notes.append("Durée hors plage. ");
        if (matching.getSectorSuitable()) notes.append("Secteur compatible. ");
        else notes.append("Secteur non couvert. ");
        if (matching.getZoneSuitable()) notes.append("Zone géographique compatible. ");
        else notes.append("Zone non couverte. ");
        matching.setNotes(notes.toString());

        return matching;
    }

    private boolean checkAmountSuitability(BigDecimal dossierAmount, PartnerEntity partner) {
        if (partner.getMinAmount() != null && dossierAmount.compareTo(partner.getMinAmount()) < 0) {
            return false;
        }
        if (partner.getMaxAmount() != null && dossierAmount.compareTo(partner.getMaxAmount()) > 0) {
            return false;
        }
        return true;
    }

    private boolean checkDurationSuitability(Integer dossierDuration, PartnerEntity partner) {
        if (partner.getMinDurationMonths() != null && dossierDuration < partner.getMinDurationMonths()) {
            return false;
        }
        if (partner.getMaxDurationMonths() != null && dossierDuration > partner.getMaxDurationMonths()) {
            return false;
        }
        return true;
    }

    private boolean checkSectorSuitability(LabelEntity dossierSector, Set<LabelEntity> partnerSectors) {
        if (dossierSector == null || partnerSectors == null || partnerSectors.isEmpty()) {
            return false;
        }
        return partnerSectors.stream()
                .anyMatch(sector -> sector.getId().equals(dossierSector.getId()));
    }

    private boolean checkZoneSuitability(String dossierRegion, Set<LabelEntity> partnerZones) {
        if (dossierRegion == null || partnerZones == null || partnerZones.isEmpty()) {
            return false;
        }
        return partnerZones.stream()
                .anyMatch(zone -> zone.getName() != null && 
                        zone.getName().equalsIgnoreCase(dossierRegion) ||
                        dossierRegion.toLowerCase().contains(zone.getName().toLowerCase()));
    }

    private MatchingResponse enrichResponse(MatchingResponse response) {
        if (response.getDossierId() != null) {
            dossierRepository.findById(response.getDossierId()).ifPresent(d -> {
                response.setDossierReference(d.getReference());
            });
        }
        if (response.getPartnerId() != null) {
            partnerRepository.findById(response.getPartnerId()).ifPresent(p -> {
                response.setPartnerName(p.getName());
            });
        }
        return response;
    }
}
