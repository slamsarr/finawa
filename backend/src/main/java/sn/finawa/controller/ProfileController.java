package sn.finawa.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.finawa.dto.ProfileResponse;
import sn.finawa.dto.administration.AdminProfileCreateRequest;
import sn.finawa.dto.administration.AdminProfileUpdateRequest;
import sn.finawa.dto.helper.Response;
import sn.finawa.service.ProfileService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/profiles", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @Operation(summary = "Create profile")
    @PostMapping
    public ResponseEntity<Response<ProfileResponse>> createProfile(@RequestBody @Valid AdminProfileCreateRequest profile) {
        return Response.created(profileService.create(profile));
    }

    @PutMapping("/{profileId}")
    public ResponseEntity<Response<ProfileResponse>> updateProfile(@PathVariable Long profileId, @RequestBody @Valid AdminProfileUpdateRequest profileDTO) {
        profileDTO.setId(profileId);
        return Response.ok(profileService.update(profileDTO));
    }

    @Operation(summary = "Read the profile", description = "This endpoint is used to read profile it take input id profile")
    @GetMapping("/{profileId}")
    public ResponseEntity<Response<ProfileResponse>> readProfile(@PathVariable Long profileId) {
        return Response.ok(profileService.read(profileId));
    }

    @Operation(summary = "delete the profile")
    @DeleteMapping("/{profileId}")
    public ResponseEntity<Response<Void>> deleteProfile(@PathVariable Long profileId) {
        profileService.delete(profileId);
        return Response.ok("Profile deleted successfully");
    }

    @Operation(summary = "Read all profiles")
    @GetMapping
    public ResponseEntity<Response<List<ProfileResponse>>> readAllProfile(@RequestParam Map<String, String> searchParams, Pageable pageable) {
        return Response.ok(profileService.readAll(searchParams, pageable));
    }
}
