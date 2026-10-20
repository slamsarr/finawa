package sn.finawa.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sn.finawa.annotation.Journal;
import sn.finawa.dto.LabelResponse;
import sn.finawa.dto.administration.AdminLabelCreateRequest;
import sn.finawa.dto.administration.AdminLabelUpdateRequest;
import sn.finawa.entity.LabelEntity;
import sn.finawa.entity.enums.ReferentialType;
import sn.finawa.mapper.LabelMapper;
import sn.finawa.repository.LabelRepository;
import sn.finawa.service.LabelService;
import sn.finawa.utility.LabelResolver;
import sn.finawa.aspect.ActionType;

import java.util.Map;


@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class LabelServiceImpl implements LabelService {

    private final LabelResolver labelResolver;
    private final LabelRepository labelRepository;
    private final LabelMapper labelMapper;

    @Override
    @Journal(actionType = ActionType.ADD_LABEL)
    public LabelResponse create(AdminLabelCreateRequest dto) {
        var label = LabelEntity
                .builder()
                .referentialType(ReferentialType.valueOf(dto.getType()))
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
        return labelMapper.asDto(labelRepository.save(label));
    }

    @Override
    @Journal(actionType = ActionType.UPDATE_LABEL)
    public LabelResponse update(AdminLabelUpdateRequest dto) {
        var label = labelResolver.getLabel(dto.getId());
        label.setReferentialType(ReferentialType.valueOf(dto.getType()));
        label.setName(dto.getName());
        label.setDescription(dto.getDescription());
        return labelMapper.asDto(labelRepository.save(label));
    }

    @Override
    public LabelResponse read(Long labelId) {
        var label = labelResolver.getLabel(labelId);
        return labelMapper.asDto(label);
    }

    @Override
    public Page<LabelResponse> readAll(Map<String, String> searchParams, Pageable pageable) {
        return labelRepository
                .readAll(searchParams, pageable)
                .map(labelMapper::asDto);
    }

    @Override
    @Journal(actionType = ActionType.DELETE_LABEL)
    public void delete(Long labelId) {
        var label = labelResolver.getLabel(labelId);
        labelRepository.delete(label);
    }
}
