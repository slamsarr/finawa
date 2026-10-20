package sn.finawa.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import sn.finawa.dto.administration.AdminUserCreateRequest;
import sn.finawa.dto.administration.AdminUserResponse;
import sn.finawa.dto.administration.AdminUserUpdateRequest;
import sn.finawa.dto.authentication.PasswordChangeRequest;

import java.util.Map;

@Service
public interface UserService {

    AdminUserResponse create(AdminUserCreateRequest dto);

    AdminUserResponse update(AdminUserUpdateRequest dto);

    AdminUserResponse read(Long id);

    Page<AdminUserResponse> readAll(Map<String, String> searchParams, Pageable pageable);

    void delete(Long id);

    AdminUserResponse activate(Long id);

    AdminUserResponse deactivate(Long id);

    void updatePassword(PasswordChangeRequest passwordDTO);
}
