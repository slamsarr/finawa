package sn.finawa.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.finawa.dto.administration.AdminJournalResponse;
import sn.finawa.dto.helper.Response;
import sn.finawa.service.JournalService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/journals", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Journal")
@RequiredArgsConstructor
@Slf4j
public class JournalController {

    private final JournalService journalService;

    @Operation(summary = "read journal")
    @GetMapping("/{journalId}")
    public ResponseEntity<Response<AdminJournalResponse>> readJournal(@PathVariable Long journalId) {
        return Response.ok(journalService.read(journalId));
    }

    @Operation(summary = "List journals")
    @GetMapping
    public ResponseEntity<Response<List<AdminJournalResponse>>> readAllJournals(@RequestParam Map<String, String> searchParams, Pageable pageable) {
        return Response.ok(journalService.readAll(searchParams, pageable));
    }
}
