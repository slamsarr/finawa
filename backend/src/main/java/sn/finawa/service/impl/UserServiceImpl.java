package sn.finawa.service.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import sn.finawa.annotation.Journal;
import sn.finawa.dto.administration.AdminUserCreateRequest;
import sn.finawa.dto.administration.AdminUserResponse;
import sn.finawa.dto.administration.AdminUserUpdateRequest;
import sn.finawa.exception.*;
import sn.finawa.entity.UserEntity;
import sn.finawa.mapper.AdminUserMapper;
import sn.finawa.dto.authentication.PasswordChangeRequest;
import sn.finawa.repository.ProfileRepository;
import sn.finawa.repository.UserRepository;
import sn.finawa.security.SecurityUtils;
import sn.finawa.service.UserService;
import sn.finawa.aspect.ActionType;

import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final AdminUserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    private static final String USER_ID_NOT_FOUND_MESSAGE = "User not found with id : ";
    private static final String USER_LOGIN_NOT_FOUND_MESSAGE = "User not found with login : ";
    private static final String DUPLICATE_LOGIN_MESSAGE = "Login already exists : ";
    private static final String PROFILE_NOT_FOUND_MESSAGE = "Profile not found with id :";
    private static final String PASSWORD_MISMATCH_MESSAGE = "Provided password does not match the old password.";


    @Override
    @Journal(actionType = ActionType.ADD_USER)
    public AdminUserResponse create(AdminUserCreateRequest dto) {
        if (userRepository.existsByLogin(dto.getLogin())) {
            throw new ResourceAlreadyExistException(DUPLICATE_LOGIN_MESSAGE + dto.getLogin());
        }
        var profile = profileRepository
                .findById(dto.getProfileId())
                .orElseThrow(() -> new ResourceNotFoundException(PROFILE_NOT_FOUND_MESSAGE + dto.getProfileId()));

        var userEntity = UserEntity
                .builder()
                .login(dto.getLogin())
                .password(passwordEncoder.encode(dto.getPassword()))
                .profile(profile)
                .firstAttempt(true)
                .active(false)
                .build();

        return userMapper.asDto(userRepository.save(userEntity));
    }

    @Override
    @Journal(actionType = ActionType.UPDATE_USER)
    public AdminUserResponse update(AdminUserUpdateRequest dto) {
        var userToUpdate = userRepository
                .findByLogin(dto.getLogin())
                .orElseThrow(() -> new ResourceNotFoundException(USER_LOGIN_NOT_FOUND_MESSAGE + dto.getLogin()));

        var profile = profileRepository
                .findById(dto.getProfileId())
                .orElseThrow(() -> new ResourceNotFoundException(PROFILE_NOT_FOUND_MESSAGE + dto.getProfileId()));

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            if (!passwordEncoder.matches(dto.getPassword(), userToUpdate.getPassword())) {
                userToUpdate.setPassword(passwordEncoder.encode(dto.getPassword()));
            }
        }
        userToUpdate.setActive(dto.isActive());
        userToUpdate.setProfile(profile);
        return userMapper.asDto(userRepository.save(userToUpdate));
    }

    @Override
    @Journal(actionType = ActionType.READ_USER)
    public AdminUserResponse read(Long id) {
        var user = getUser(id);
        return userMapper.asDto(user);
    }

    @Override
    @Journal(actionType = ActionType.DELETE_USER)
    public void delete(Long id) {
        var user = getUser(id);
        var currentUser = SecurityUtils.getCurrentUserLogin();
        if (currentUser.isPresent() && currentUser.get().equals(user.getLogin())) {
            throw new InvalidArgumentType("You can't delete yourself");
        }
        userRepository.delete(user);
    }

    @Override
    @Journal(actionType = ActionType.READ_USER)
    public Page<AdminUserResponse> readAll(@RequestParam Map<String, String> searchParams, Pageable pageable) {
        return userRepository
                .readAll(searchParams, pageable)
                .map(userMapper::asDto);
    }

    @Override
    @Journal(actionType = ActionType.ACTIVATE_USER)
    public AdminUserResponse activate(Long id) {
        var user = getUser(id);
        var currentUser = SecurityUtils.getCurrentUserLogin();
        if (currentUser.isPresent() && currentUser.get().equals(user.getLogin())) {
            throw new InvalidArgumentType("You can't enable or disable yourself");
        }
        user.setActive(true);
        user = userRepository.save(user);
        return userMapper.asDto(user);
    }

    @Override
    @Journal(actionType = ActionType.DEACTIVATE_USER)
    public AdminUserResponse deactivate(Long id) {
        var user = getUser(id);
        var currentUser = SecurityUtils.getCurrentUserLogin();
        if (currentUser.isPresent() && currentUser.get().equals(user.getLogin())) {
            throw new InvalidArgumentType("You can't enable or disable yourself");
        }
        user.setActive(false);
        user = userRepository.save(user);
        return userMapper.asDto(user);
    }

    @Override
    @Journal(actionType = ActionType.PASSWORD_UPDATE)
    public void updatePassword(PasswordChangeRequest passwordDTO) {
        var login = SecurityUtils.getCurrentUserLogin();
        if (login.isEmpty()) {
            throw new UnauthorizedException("No login info found");
        }
        var user = userRepository
                .findByLogin(login.get())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(passwordDTO.getOldPassword(), user.getPassword())) {
            throw new PasswordException(PASSWORD_MISMATCH_MESSAGE);
        }
        user.setPassword(passwordEncoder.encode(passwordDTO.getNewPassword()));
        userRepository.save(user);
    }

    private UserEntity getUser(Long id) {
        return userRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(USER_ID_NOT_FOUND_MESSAGE + id));
    }
}