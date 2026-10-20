package sn.finawa.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.finawa.dto.PartnerCreateRequest;
import sn.finawa.dto.PartnerResponse;
import sn.finawa.dto.PartnerUpdateRequest;
import sn.finawa.dto.helper.Response;
import sn.finawa.service.PartnerService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/partners", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Partner")
@RequiredArgsConstructor
public class PartnerController {

    private final PartnerService partnerService;

    @Operation(summary = "Create partner")
    @PostMapping
    public ResponseEntity<Response<PartnerResponse>> createPartner(@Valid @RequestBody PartnerCreateRequest request) {
        return Response.created(partnerService.create(request));
    }

    @Operation(summary = "Update partner")
    @PutMapping
    public ResponseEntity<Response<PartnerResponse>> updatePartner(@Valid @RequestBody PartnerUpdateRequest request) {
        return Response.ok(partnerService.update(request));
    }

    @Operation(summary = "Read partner by ID")
    @GetMapping("/{partnerId}")
    public ResponseEntity<Response<PartnerResponse>> readPartner(@PathVariable Long partnerId) {
        return Response.ok(partnerService.read(partnerId));
    }

    @Operation(summary = "Read partner by user ID")
    @GetMapping("/user/{userId}")
    public ResponseEntity<Response<PartnerResponse>> readPartnerByUser(@PathVariable Long userId) {
        return Response.ok(partnerService.readByUser(userId));
    }

    @Operation(summary = "List partners")
    @GetMapping
    public ResponseEntity<Response<List<PartnerResponse>>> readAllPartners(@RequestParam Map<String, String> searchParams, Pageable pageable) {
        return Response.ok(partnerService.readAll(searchParams, pageable));
    }

    @Operation(summary = "List active partners")
    @GetMapping("/active")
    public ResponseEntity<Response<List<PartnerResponse>>> readActivePartners() {
        return Response.ok(partnerService.readActive());
    }

    @Operation(summary = "List partners by type")
    @GetMapping("/type/{type}")
    public ResponseEntity<Response<List<PartnerResponse>>> readPartnersByType(@PathVariable String type) {
        return Response.ok(partnerService.readByType(type));
    }

    @Operation(summary = "Delete partner")
    @DeleteMapping("/{partnerId}")
    public ResponseEntity<Response<Void>> deletePartner(@PathVariable Long partnerId) {
        partnerService.delete(partnerId);
        return Response.ok("Partner deleted successfully");
    }

    @Operation(summary = "Activate partner")
    @PatchMapping("/{partnerId}/activate")
    public ResponseEntity<Response<PartnerResponse>> activatePartner(@PathVariable Long partnerId) {
        return Response.ok(partnerService.activate(partnerId));
    }

    @Operation(summary = "Deactivate partner")
    @PatchMapping("/{partnerId}/deactivate")
    public ResponseEntity<Response<PartnerResponse>> deactivatePartner(@PathVariable Long partnerId) {
        return Response.ok(partnerService.deactivate(partnerId));
    }
}
