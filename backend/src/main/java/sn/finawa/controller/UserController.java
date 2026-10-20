package sn.finawa.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.finawa.dto.administration.AdminUserCreateRequest;
import sn.finawa.dto.administration.AdminUserUpdateRequest;
import sn.finawa.dto.helper.Response;
import sn.finawa.dto.authentication.PasswordChangeRequest;
import sn.finawa.dto.administration.AdminUserResponse;
import sn.finawa.service.UserService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/users", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "User")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @Operation(summary = "Create user")
    @PostMapping
    public ResponseEntity<Response<AdminUserResponse>> createUser(@Valid @RequestBody AdminUserCreateRequest user) {
        return Response.created(userService.create(user));
    }

    @Operation(summary = "Update user")
    @PutMapping
    public ResponseEntity<Response<AdminUserResponse>> updateUser(@Valid @RequestBody AdminUserUpdateRequest user) {
        return Response.ok(userService.update(user));
    }

    @Operation(summary = "Activate user")
    @PatchMapping("/activate/{id}")
    public ResponseEntity<Response<AdminUserResponse>> activateUser(@PathVariable Long id) {
        return Response.ok(userService.activate(id));
    }

    @Operation(summary = "Deactivate user")
    @PatchMapping("/deactivate/{id}")
    public ResponseEntity<Response<AdminUserResponse>> deactivateUser(@PathVariable Long id) {
        return Response.ok(userService.deactivate(id));
    }

    @Operation(summary = "Read user")
    @GetMapping("/{userId}")
    public ResponseEntity<Response<AdminUserResponse>> readUser(@PathVariable Long userId) {
        return Response.ok(userService.read(userId));
    }

    @Operation(summary = "Delete user")
    @DeleteMapping("/{userId}")
    public ResponseEntity<Response<Void>> deleteUser(@PathVariable Long userId) {
        userService.delete(userId);
        return Response.ok("User deactivated successfully");
    }

    @Operation(summary = "List users")
    @GetMapping
    public ResponseEntity<Response<List<AdminUserResponse>>> readAllUser(@RequestParam Map<String, String> searchParams, Pageable pageable) {
        return Response.ok(userService.readAll(searchParams, pageable));
    }

    @Operation(summary = "Update password")
    @PostMapping("/password-update")
    public ResponseEntity<Response<Void>> updatePassword(@Valid @RequestBody PasswordChangeRequest passwordDTO) {
        userService.updatePassword(passwordDTO);
        return Response.ok("Password Updated successfully");
    }
}
