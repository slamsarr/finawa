package sn.finawa.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.finawa.dto.DossierCreateRequest;
import sn.finawa.dto.DossierResponse;
import sn.finawa.dto.DossierUpdateRequest;
import sn.finawa.dto.form.DossierFormData;
import sn.finawa.dto.helper.Response;
import sn.finawa.service.DossierService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/dossiers", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Dossier")
@RequiredArgsConstructor
public class DossierController {

    private final DossierService dossierService;

    @Operation(summary = "Create dossier")
    @PostMapping
    public ResponseEntity<Response<DossierResponse>> createDossier(@Valid @RequestBody DossierCreateRequest request) {
        return Response.created(dossierService.create(request));
    }

    @Operation(summary = "Update dossier")
    @PutMapping
    public ResponseEntity<Response<DossierResponse>> updateDossier(@Valid @RequestBody DossierUpdateRequest request) {
        return Response.ok(dossierService.update(request));
    }

    @Operation(summary = "Read dossier by ID")
    @GetMapping("/{dossierId}")
    public ResponseEntity<Response<DossierResponse>> readDossier(@PathVariable Long dossierId) {
        return Response.ok(dossierService.read(dossierId));
    }

    @Operation(summary = "Read dossier by reference")
    @GetMapping("/reference/{reference}")
    public ResponseEntity<Response<DossierResponse>> readDossierByReference(@PathVariable String reference) {
        return Response.ok(dossierService.readByReference(reference));
    }

    @Operation(summary = "List dossiers")
    @GetMapping
    public ResponseEntity<Response<List<DossierResponse>>> readAllDossiers(@RequestParam Map<String, String> searchParams, Pageable pageable) {
        return Response.ok(dossierService.readAll(searchParams, pageable));
    }

    @Operation(summary = "List dossiers by enterprise")
    @GetMapping("/enterprise/{enterpriseId}")
    public ResponseEntity<Response<List<DossierResponse>>> readDossiersByEnterprise(@PathVariable Long enterpriseId) {
        return Response.ok(dossierService.readByEnterprise(enterpriseId));
    }

    @Operation(summary = "List dossiers by status")
    @GetMapping("/status/{status}")
    public ResponseEntity<Response<List<DossierResponse>>> readDossiersByStatus(@PathVariable String status) {
        return Response.ok(dossierService.readByStatus(status));
    }

    @Operation(summary = "Delete dossier")
    @DeleteMapping("/{dossierId}")
    public ResponseEntity<Response<Void>> deleteDossier(@PathVariable Long dossierId) {
        dossierService.delete(dossierId);
        return Response.ok("Dossier deleted successfully");
    }

    @Operation(summary = "Submit dossier")
    @PostMapping("/{dossierId}/submit")
    public ResponseEntity<Response<DossierResponse>> submitDossier(@PathVariable Long dossierId) {
        return Response.ok(dossierService.submit(dossierId));
    }

    @Operation(summary = "Update dossier status")
    @PatchMapping("/{dossierId}/status")
    public ResponseEntity<Response<DossierResponse>> updateStatus(@PathVariable Long dossierId, @RequestBody Map<String, String> statusMap) {
        return Response.ok(dossierService.updateStatus(dossierId, statusMap.get("status")));
    }

    @Operation(summary = "Export prefilled CEP Excel model")
    @GetMapping(value = "/{dossierId}/export-cep", produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public ResponseEntity<Resource> exportCep(@PathVariable Long dossierId) {
        var exportResult = dossierService.exportCep(dossierId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + exportResult.filename() + "\"")
                .header(HttpHeaders.CONTENT_TYPE, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                .contentLength(exportResult.contentLength())
                .body(exportResult.resource());
    }

    @Operation(summary = "Save or update structured financing form")
    @PostMapping("/{dossierId}/form")
    public ResponseEntity<Response<DossierResponse>> saveForm(
            @PathVariable Long dossierId,
            @RequestBody DossierFormData formData,
            @RequestParam(required = false, defaultValue = "false") Boolean isDraft) {
        return Response.ok(dossierService.saveFormData(dossierId, formData, isDraft));
    }

    @Operation(summary = "Read structured financing form data")
    @GetMapping("/{dossierId}/form")
    public ResponseEntity<Response<DossierFormData>> getForm(@PathVariable Long dossierId) {
        return Response.ok(dossierService.getFormData(dossierId));
    }

    @Operation(summary = "Update expert analysis notes")
    @PatchMapping("/{dossierId}/expert-notes")
    public ResponseEntity<Response<DossierResponse>> updateExpertNotes(
            @PathVariable Long dossierId,
            @RequestBody Map<String, String> body) {
        return Response.ok(dossierService.updateExpertNotes(dossierId, body.get("expertNotes")));
    }
}
