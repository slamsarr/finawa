package sn.finawa.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import sn.finawa.dto.EnterpriseCreateRequest;
import sn.finawa.dto.EnterpriseResponse;
import sn.finawa.dto.EnterpriseUpdateRequest;
import sn.finawa.dto.helper.Response;
import sn.finawa.service.EnterpriseService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/enterprises", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Enterprise")
@RequiredArgsConstructor
public class EnterpriseController {
    private final EnterpriseService enterpriseService;

    @Operation(summary = "Create Enterprise")
    @PostMapping
    public ResponseEntity<Response<EnterpriseResponse>> createEnterprise(@Valid @RequestBody EnterpriseCreateRequest req) {
        return Response.created(enterpriseService.create(req));
    }

    @Operation(summary = "Get current enterprise profile")
    @GetMapping("/me")
    public ResponseEntity<Response<EnterpriseResponse>> getMyEnterprise() {
        return Response.ok(enterpriseService.readMyEnterprise());
    }

    @Operation(summary = "Update current enterprise profile")
    @PutMapping("/me")
    public ResponseEntity<Response<EnterpriseResponse>> updateMyEnterprise(@Valid @RequestBody EnterpriseUpdateRequest req) {
        return Response.ok(enterpriseService.updateMyEnterprise(req));
    }

    @Operation(summary = "Read enterprise by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Response<EnterpriseResponse>> readEnterprise(@PathVariable Long id) {
        return Response.ok(enterpriseService.read(id));
    }

    @Operation(summary = "Update enterprise by ID")
    @PutMapping("/{id}")
    public ResponseEntity<Response<EnterpriseResponse>> updateEnterprise(@PathVariable Long id, @Valid @RequestBody EnterpriseUpdateRequest req) {
        req.setId(id);
        return Response.ok(enterpriseService.update(req));
    }

    @Operation(summary = "List enterprises")
    @GetMapping
    public ResponseEntity<Response<List<EnterpriseResponse>>> readAllEnterprises(@RequestParam Map<String, String> searchParams, Pageable pageable) {
        return Response.ok(enterpriseService.readAll(searchParams, pageable));
    }

    @Operation(summary = "Delete enterprise")
    @DeleteMapping("/{id}")
    public ResponseEntity<Response<Void>> deleteEnterprise(@PathVariable Long id) {
        enterpriseService.delete(id);
        return Response.ok("Enterprise deleted successfully");
    }
}
