package sn.finawa.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sn.finawa.annotation.Journal;
import sn.finawa.dto.administration.AdminProfileCreateRequest;
import sn.finawa.dto.administration.AdminProfileUpdateRequest;
import sn.finawa.entity.ProfileEntity;
import sn.finawa.exception.ResourceAlreadyExistException;
import sn.finawa.exception.ResourceNotFoundException;
import sn.finawa.mapper.ProfileMapper;
import sn.finawa.dto.helper.PermissionResponse;
import sn.finawa.dto.ProfileResponse;
import sn.finawa.repository.ProfileRepository;
import sn.finawa.service.ProfileService;
import sn.finawa.aspect.ActionType;

import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;


@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ProfileServiceImpl implements ProfileService {
    private final ProfileRepository profileRepository;
    private final ProfileMapper profileMapper;

    private final static String PROFILE_ID_NOT_FOUND_MESSAGE = "Profile not found with id : ";
    private final static String PROFILE_NAME_ALREADY_EXISTS = "Profile already exists with name : ";

    @Override
    @Journal(actionType = ActionType.ADD_PROFILE)
    public ProfileResponse create(AdminProfileCreateRequest dto) {
        if (profileRepository.existsByName(dto.getName())) {
            throw new ResourceAlreadyExistException(PROFILE_NAME_ALREADY_EXISTS + dto.getName());
        }
        var profile = ProfileEntity
                .builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .permissions(dto.getPermissionNames()
                        .stream()
                        .map(PermissionResponse::get)
                        .filter(Objects::nonNull)
                        .map(PermissionResponse::getType)
                        .collect(Collectors.toSet()))
                .build();
        return profileMapper.asDto(profileRepository.save(profile));
    }

    @Override
    @Journal(actionType = ActionType.UPDATE_PROFILE)
    public ProfileResponse update(AdminProfileUpdateRequest dto) {
        var profileToUpdate = profileRepository
                .findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException(PROFILE_ID_NOT_FOUND_MESSAGE + dto.getId()));

        if (profileRepository.existsByNameAndIdNot(dto.getName(), dto.getId())) {
            throw new ResourceAlreadyExistException(PROFILE_NAME_ALREADY_EXISTS + dto.getName());
        }
        profileToUpdate.setName(dto.getName());
        profileToUpdate.setDescription(dto.getDescription());
        profileToUpdate.setPermissions(dto.getPermissionNames()
                .stream()
                .map(PermissionResponse::get)
                .filter(Objects::nonNull)
                .map(PermissionResponse::getType)
                .collect(Collectors.toSet())
        );
        profileToUpdate = profileRepository.save(profileToUpdate);
        return profileMapper.asDto(profileToUpdate);
    }

    @Override
    public ProfileResponse read(Long profileId) {
        var profile = profileRepository
                .findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException(PROFILE_ID_NOT_FOUND_MESSAGE + profileId));
        return profileMapper.asDto(profile);
    }

    @Override
    public Page<ProfileResponse> readAll(Map<String, String> searchParams, Pageable pageable) {
        return profileRepository
                .readAll(searchParams, pageable)
                .map(profileMapper::asDto);
    }

    @Override
    @Journal(actionType = ActionType.DELETE_PROFILE)
    public void delete(Long profileId) {
        var profile = profileRepository
                .findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException(PROFILE_ID_NOT_FOUND_MESSAGE + profileId));
        profileRepository.delete(profile);
    }
}
