package sn.finawa.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.finawa.dto.LabelResponse;
import sn.finawa.dto.administration.AdminLabelCreateRequest;
import sn.finawa.dto.administration.AdminLabelUpdateRequest;
import sn.finawa.dto.helper.ReferentialResponse;
import sn.finawa.dto.helper.Response;
import sn.finawa.service.LabelService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/labels", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Label")
@RequiredArgsConstructor
public class LabelController {

    private final LabelService labelService;

    @Operation(summary = "Create label")
    @PostMapping
    public ResponseEntity<Response<LabelResponse>> createLabel(@Valid @RequestBody AdminLabelCreateRequest label) {
        return Response.created(labelService.create(label));
    }

    @Operation(summary = "Update label")
    @PatchMapping("/{labelId}")
    public ResponseEntity<Response<LabelResponse>> updateLabel(@PathVariable Long labelId, @Valid @RequestBody AdminLabelUpdateRequest label) {
        label.setId(labelId);
        return Response.ok(labelService.update(label));
    }

    @Operation(summary = "Read the label")
    @GetMapping("/{labelId}")
    public ResponseEntity<Response<LabelResponse>> readLabel(@PathVariable Long labelId) {
        return Response.ok(labelService.read(labelId));
    }

    @Operation(summary = "List Labels")
    @GetMapping
    public ResponseEntity<Response<List<LabelResponse>>> readAllLabel(@RequestParam Map<String, String> searchParams, Pageable pageable) {
        return Response.ok(labelService.readAll(searchParams, pageable));
    }

    @Operation(summary = "delete the label", description = "Delete label, it take input id label")
    @DeleteMapping("/{labelId}")
    public ResponseEntity<Response<Void>> deleteLabel(@PathVariable Long labelId) {
        labelService.delete(labelId);
        return Response.ok("Label deleted successfully");
    }

    @Operation(summary = "Read all referential types")
    @GetMapping("/refs")
    public ResponseEntity<Response<List<ReferentialResponse>>> readAllReferentialTypes() {
        return Response.ok(ReferentialResponse.getAll());
    }
}
