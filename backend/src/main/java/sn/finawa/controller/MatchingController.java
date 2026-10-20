package sn.finawa.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.finawa.dto.helper.Response;
import sn.finawa.dto.MatchingResponse;
import sn.finawa.service.MatchingService;

import java.util.List;

@RestController
@RequestMapping(value = "/matching", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Matching")
@RequiredArgsConstructor
public class MatchingController {

    private final MatchingService matchingService;

    @Operation(summary = "Run matching for a dossier")
    @PostMapping("/dossier/{dossierId}")
    public ResponseEntity<Response<List<MatchingResponse>>> runMatching(@PathVariable Long dossierId) {
        return Response.ok(matchingService.runMatching(dossierId));
    }

    @Operation(summary = "Get matching results for a dossier")
    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<Response<List<MatchingResponse>>> getMatchingForDossier(@PathVariable Long dossierId) {
        return Response.ok(matchingService.getMatchingForDossier(dossierId));
    }

    @Operation(summary = "Get matching results for a partner")
    @GetMapping("/partner/{partnerId}")
    public ResponseEntity<Response<List<MatchingResponse>>> getMatchingForPartner(@PathVariable Long partnerId) {
        return Response.ok(matchingService.getMatchingForPartner(partnerId));
    }

    @Operation(summary = "Update matching status")
    @PatchMapping("/{matchingId}/status")
    public ResponseEntity<Response<MatchingResponse>> updateMatchingStatus(
            @PathVariable Long matchingId,
            @RequestBody java.util.Map<String, String> statusMap) {
        return Response.ok(matchingService.updateStatus(matchingId, statusMap.get("status")));
    }

    @Operation(summary = "Delete matching")
    @DeleteMapping("/{matchingId}")
    public ResponseEntity<Response<Void>> deleteMatching(@PathVariable Long matchingId) {
        matchingService.delete(matchingId);
        return Response.ok("Matching deleted successfully");
    }

    @Operation(summary = "Clear all matching for a dossier")
    @DeleteMapping("/dossier/{dossierId}")
    public ResponseEntity<Response<Void>> clearMatchingForDossier(@PathVariable Long dossierId) {
        matchingService.clearForDossier(dossierId);
        return Response.ok("Matching cleared successfully");
    }
}
