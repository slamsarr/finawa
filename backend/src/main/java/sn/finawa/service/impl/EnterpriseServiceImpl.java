package sn.finawa.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sn.finawa.dto.EnterpriseCreateRequest;
import sn.finawa.dto.EnterpriseResponse;
import sn.finawa.dto.EnterpriseUpdateRequest;
import sn.finawa.entity.EnterpriseEntity;
import sn.finawa.entity.UserEntity;
import sn.finawa.entity.enums.ReferentialType;
import sn.finawa.exception.InternalError;
import sn.finawa.exception.ResourceAlreadyExistException;
import sn.finawa.exception.ResourceNotFoundException;
import sn.finawa.mapper.EnterpriseMapper;
import sn.finawa.repository.EnterpriseRepository;
import sn.finawa.repository.ProfileRepository;
import sn.finawa.repository.UserRepository;
import sn.finawa.service.EnterpriseService;
import sn.finawa.utility.LabelResolver;

import sn.finawa.exception.UnauthorizedException;
import sn.finawa.security.SecurityUtils;

import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class EnterpriseServiceImpl implements EnterpriseService {

    private final EnterpriseRepository enterpriseRepository;
    private final EnterpriseMapper enterpriseMapper;
    private final LabelResolver labelResolver;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final sn.finawa.service.VerificationTokenService verificationTokenService;

    private static final String ENTERPRISE_PROFILE_NAME = "ENTREPRISE";
    private static final String DUPLICATE_LOGIN_MESSAGE = "Login already exists : ";
    private static final String PROFILE_NOT_FOUND_MESSAGE = "Profile '" + ENTERPRISE_PROFILE_NAME + "' does not exist";

    @Override
    public EnterpriseResponse create(EnterpriseCreateRequest dto) {
        if (userRepository.existsByLogin(dto.getEmail())) {
            throw new ResourceAlreadyExistException(DUPLICATE_LOGIN_MESSAGE + dto.getEmail());
        }
        var profile = profileRepository
                .findByName(ENTERPRISE_PROFILE_NAME)
                .orElseThrow(() -> new ResourceNotFoundException(PROFILE_NOT_FOUND_MESSAGE));

        var userEntity = UserEntity
                .builder()
                .login(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .profile(profile)
                .firstAttempt(true)
                .active(false)
                .build();

        userEntity = userRepository.save(userEntity);
        if (userEntity.getId() != null) {
            var enterpriseEntity = EnterpriseEntity
                    .builder()
                    .user(userEntity)
                    .name(dto.getName())
                    .summary(dto.getSummary())
                    .region(dto.getRegion())
                    .annualTurnover(dto.getAnnualTurnover())
                    .employeeCount(dto.getEmployeeCount())
                    .creationDate(dto.getCreationDate())
                    .type(labelResolver.getLabel(dto.getTypeId(), ReferentialType.ENTERPRISE_TYPE))
                    .sector(labelResolver.getLabel(dto.getSectorId(), ReferentialType.ENTERPRISE_SECTOR))
                    .build();
            var savedEnterprise = enterpriseRepository.save(enterpriseEntity);

            verificationTokenService.sendVerificationEmail(userEntity, dto.getEmail(), dto.getName());

            return enterpriseMapper.asDto(savedEnterprise);
        }
        throw new InternalError("An error occurred during enterprise creation");
    }

    @Override
    public EnterpriseResponse readMyEnterprise() {
        var currentUserLogin = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new UnauthorizedException("No login info found"));
        var enterprise = enterpriseRepository.findByUserLogin(currentUserLogin)
                .orElseThrow(() -> new ResourceNotFoundException("Enterprise profile not found for user: " + currentUserLogin));
        return enterpriseMapper.asDto(enterprise);
    }

    @Override
    public EnterpriseResponse updateMyEnterprise(EnterpriseUpdateRequest dto) {
        var currentUserLogin = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new UnauthorizedException("No login info found"));
        var enterprise = enterpriseRepository.findByUserLogin(currentUserLogin)
                .orElseThrow(() -> new ResourceNotFoundException("Enterprise profile not found for user: " + currentUserLogin));
        updateEnterpriseFromDto(enterprise, dto);
        return enterpriseMapper.asDto(enterpriseRepository.save(enterprise));
    }

    @Override
    public EnterpriseResponse update(EnterpriseUpdateRequest dto) {
        if (dto.getId() == null) {
            throw new IllegalArgumentException("Enterprise ID cannot be null for update");
        }
        var enterprise = enterpriseRepository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Enterprise not found with id: " + dto.getId()));
        updateEnterpriseFromDto(enterprise, dto);
        return enterpriseMapper.asDto(enterpriseRepository.save(enterprise));
    }

    @Override
    public EnterpriseResponse read(Long id) {
        var enterprise = enterpriseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enterprise not found with id: " + id));
        return enterpriseMapper.asDto(enterprise);
    }

    @Override
    public Page<EnterpriseResponse> readAll(Map<String, String> searchParams, Pageable pageable) {
        return enterpriseRepository.readAll(searchParams, pageable).map(enterpriseMapper::asDto);
    }

    @Override
    public void delete(Long id) {
        var enterprise = enterpriseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enterprise not found with id: " + id));
        enterpriseRepository.delete(enterprise);
    }

    private void updateEnterpriseFromDto(EnterpriseEntity enterprise, EnterpriseUpdateRequest dto) {
        if (dto.getName() != null) {
            enterprise.setName(dto.getName());
        }
        if (dto.getSummary() != null) {
            enterprise.setSummary(dto.getSummary());
        }
        if (dto.getRegion() != null) {
            enterprise.setRegion(dto.getRegion());
        }
        if (dto.getAnnualTurnover() != null) {
            enterprise.setAnnualTurnover(dto.getAnnualTurnover());
        }
        if (dto.getEmployeeCount() != null) {
            enterprise.setEmployeeCount(dto.getEmployeeCount());
        }
        if (dto.getCreationDate() != null) {
            enterprise.setCreationDate(dto.getCreationDate());
        }
        if (dto.getTypeId() != null) {
            enterprise.setType(labelResolver.getLabel(dto.getTypeId(), ReferentialType.ENTERPRISE_TYPE));
        }
        if (dto.getSectorId() != null) {
            enterprise.setSector(labelResolver.getLabel(dto.getSectorId(), ReferentialType.ENTERPRISE_SECTOR));
        }
    }
}
