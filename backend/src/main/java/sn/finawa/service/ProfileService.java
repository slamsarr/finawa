package sn.finawa.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import sn.finawa.dto.ProfileResponse;
import sn.finawa.dto.administration.AdminProfileCreateRequest;
import sn.finawa.dto.administration.AdminProfileUpdateRequest;

import java.util.Map;

@Service
public interface ProfileService {

    ProfileResponse create(AdminProfileCreateRequest dto);

    ProfileResponse update(AdminProfileUpdateRequest dto);

    ProfileResponse read(Long id);

    Page<ProfileResponse> readAll(Map<String, String> searchParams, Pageable pageable);

    void delete(Long id);

}
