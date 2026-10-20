package sn.finawa.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sn.finawa.dto.PartnerCreateRequest;
import sn.finawa.dto.PartnerResponse;
import sn.finawa.dto.PartnerUpdateRequest;
import sn.finawa.entity.LabelEntity;
import sn.finawa.entity.PartnerEntity;
import sn.finawa.entity.UserEntity;
import sn.finawa.exception.ResourceNotFoundException;
import sn.finawa.mapper.PartnerMapper;
import sn.finawa.repository.LabelRepository;
import sn.finawa.repository.PartnerRepository;
import sn.finawa.repository.UserRepository;
import sn.finawa.service.PartnerService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PartnerServiceImpl implements PartnerService {

    private final PartnerRepository partnerRepository;
    private final UserRepository userRepository;
    private final LabelRepository labelRepository;
    private final PartnerMapper partnerMapper;

    @Override
    public PartnerResponse create(PartnerCreateRequest request) {
        UserEntity user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        PartnerEntity entity = partnerMapper.toEntity(request);
        entity.setUser(user);
        entity.setActive(true);
        entity.setScore(0);

        if (request.getPartnerTypeId() != null) {
            LabelEntity partnerType = labelRepository.findById(request.getPartnerTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Partner type not found"));
            entity.setPartnerType(partnerType);
        }

        if (request.getZoneIds() != null && !request.getZoneIds().isEmpty()) {
            List<LabelEntity> zones = labelRepository.findAllById(request.getZoneIds());
            entity.setZones(new java.util.HashSet<>(zones));
        }

        if (request.getSectorIds() != null && !request.getSectorIds().isEmpty()) {
            List<LabelEntity> sectors = labelRepository.findAllById(request.getSectorIds());
            entity.setSectors(new java.util.HashSet<>(sectors));
        }

        PartnerEntity saved = partnerRepository.save(entity);
        return enrichResponse(partnerMapper.toResponse(saved));
    }

    @Override
    public PartnerResponse update(PartnerUpdateRequest request) {
        PartnerEntity entity = partnerRepository.findById(request.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Partner not found"));

        if (request.getUserId() != null) {
            UserEntity user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            entity.setUser(user);
        }

        if (request.getPartnerTypeId() != null) {
            LabelEntity partnerType = labelRepository.findById(request.getPartnerTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Partner type not found"));
            entity.setPartnerType(partnerType);
        }

        if (request.getZoneIds() != null) {
            List<LabelEntity> zones = labelRepository.findAllById(request.getZoneIds());
            entity.setZones(new java.util.HashSet<>(zones));
        }

        if (request.getSectorIds() != null) {
            List<LabelEntity> sectors = labelRepository.findAllById(request.getSectorIds());
            entity.setSectors(new java.util.HashSet<>(sectors));
        }

        partnerMapper.updateEntityFromDto(request, entity);
        PartnerEntity saved = partnerRepository.save(entity);
        return enrichResponse(partnerMapper.toResponse(saved));
    }

    @Override
    public PartnerResponse read(Long id) {
        PartnerEntity entity = partnerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Partner not found"));
        return enrichResponse(partnerMapper.toResponse(entity));
    }

    @Override
    public PartnerResponse readByUser(Long userId) {
        PartnerEntity entity = partnerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Partner not found for this user"));
        return enrichResponse(partnerMapper.toResponse(entity));
    }

    @Override
    public List<PartnerResponse> readAll(Map<String, String> searchParams, Pageable pageable) {
        Page<PartnerEntity> page = partnerRepository.findAll(pageable);
        return page.getContent().stream()
                .map(partnerMapper::toResponse)
                .map(this::enrichResponse)
                .toList();
    }

    @Override
    public List<PartnerResponse> readActive() {
        List<PartnerEntity> entities = partnerRepository.findByActiveTrue();
        return entities.stream()
                .map(partnerMapper::toResponse)
                .map(this::enrichResponse)
                .toList();
    }

    @Override
    public List<PartnerResponse> readByType(String type) {
        List<PartnerEntity> entities = partnerRepository.findByType(type);
        return entities.stream()
                .map(partnerMapper::toResponse)
                .map(this::enrichResponse)
                .toList();
    }

    @Override
    public void delete(Long id) {
        if (!partnerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Partner not found");
        }
        partnerRepository.deleteById(id);
    }

    @Override
    public PartnerResponse activate(Long id) {
        PartnerEntity entity = partnerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Partner not found"));
        entity.setActive(true);
        PartnerEntity saved = partnerRepository.save(entity);
        return enrichResponse(partnerMapper.toResponse(saved));
    }

    @Override
    public PartnerResponse deactivate(Long id) {
        PartnerEntity entity = partnerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Partner not found"));
        entity.setActive(false);
        PartnerEntity saved = partnerRepository.save(entity);
        return enrichResponse(partnerMapper.toResponse(saved));
    }

    private PartnerResponse enrichResponse(PartnerResponse response) {
        if (response.getPartnerTypeId() != null) {
            labelRepository.findById(response.getPartnerTypeId()).ifPresent(l -> {
                response.setPartnerTypeName(l.getName());
            });
        }

        PartnerEntity entity = partnerRepository.findById(response.getId()).orElse(null);
        if (entity != null) {
            response.setZoneNames(entity.getZones().stream()
                    .map(LabelEntity::getName)
                    .collect(Collectors.toList()));
            response.setSectorNames(entity.getSectors().stream()
                    .map(LabelEntity::getName)
                    .collect(Collectors.toList()));
        }

        return response;
    }
}
