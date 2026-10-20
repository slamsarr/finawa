package sn.finawa.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.finawa.dto.helper.FeatureResponse;
import sn.finawa.dto.helper.PermissionResponse;
import sn.finawa.dto.helper.Response;

import java.util.List;

@RestController
@RequestMapping(value = "/permissions", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Permission")
@RequiredArgsConstructor
public class SecurityPermissionController {

    @Operation(summary = "Read all permissions")
    @GetMapping
    public ResponseEntity<Response<List<PermissionResponse>>> readAllPermissions() {
        return Response.ok(PermissionResponse.getAll());
    }

    @Operation(summary = "Read permissions by feature")
    @GetMapping("/{featureName}")
    public ResponseEntity<Response<List<PermissionResponse>>> readPermissionsByFeature(@PathVariable("featureName") String featureName) {
        return Response.ok(PermissionResponse.getByFeature(featureName));
    }

    @Operation(summary = "Read permissions by feature")
    @GetMapping("/feature")
    public ResponseEntity<Response<List<FeatureResponse>>> readAllFeatures() {
        return Response.ok(FeatureResponse.getAll());
    }
}
