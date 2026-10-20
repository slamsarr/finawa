package sn.finawa.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.finawa.dto.AlertResponse;
import sn.finawa.dto.helper.Response;
import sn.finawa.dto.administration.AdminAlertCreateRequest;
import sn.finawa.dto.administration.AdminAlertUpdateRequest;
import sn.finawa.service.AlertService;

import java.util.*;

@RestController
@RequestMapping(value = "/alerts", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Alert")
@RequiredArgsConstructor
@Slf4j
public class AlertController {

    private final AlertService alertService;

    @Operation(summary = "read alert")
    @GetMapping("/{alertId}")
    public ResponseEntity<Response<AlertResponse>> readAlert(@PathVariable Long alertId) {
        return Response.ok(alertService.read(alertId));
    }

    @Operation(summary = "List alerts")
    @GetMapping
    public ResponseEntity<Response<List<AlertResponse>>> readAllAlerts(@RequestParam Map<String, String> searchParams, Pageable pageable) {
        return Response.ok(alertService.readAll(searchParams, pageable));
    }

    @Operation(summary = "create alert")
    @PostMapping
    public ResponseEntity<Response<AlertResponse>> createAlert(@RequestBody @Valid AdminAlertCreateRequest dto) {
        return Response.created(alertService.create(dto));
    }

    @Operation(summary = "mark alert as read")
    @PostMapping("/read/{alertId}")
    public ResponseEntity<Response<AlertResponse>> markAsRead(@PathVariable Long alertId) {
        return Response.ok(alertService.markAsRead(alertId));
    }

    @Operation(summary = "update alert")
    @PutMapping
    public ResponseEntity<Response<AlertResponse>> updateAlert(@RequestBody @Valid AdminAlertUpdateRequest dto) {
        return Response.ok(alertService.update(dto));
    }

    @Operation(summary = "delete alert")
    @DeleteMapping("/{alertId}")
    public ResponseEntity<Response<Void>> deleteAlert(@PathVariable Long alertId) {
        alertService.delete(alertId);
        return Response.ok("Deleted Successfully");
    }
}
