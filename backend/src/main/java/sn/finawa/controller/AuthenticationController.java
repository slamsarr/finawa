package sn.finawa.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.web.bind.annotation.*;
import sn.finawa.dto.authentication.LoginResponse;
import sn.finawa.dto.authentication.LoginRequest;
import sn.finawa.dto.helper.Response;
import sn.finawa.dto.authentication.TokenDTO;
import sn.finawa.properties.JwtProperties;
import sn.finawa.service.AuthenticationService;


@RestController
@RequestMapping(value = "/auth", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Authentication")
@RequiredArgsConstructor
@Slf4j
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final LogoutHandler logoutHandler;
    private final JwtProperties jwtProperties;
    private final sn.finawa.service.VerificationTokenService verificationTokenService;
    private final sn.finawa.service.PasswordResetService passwordResetService;

    @Operation(summary = "Sign in by login and password")
    @PostMapping("/signIn")
    public ResponseEntity<Response<LoginResponse>> signIn(@RequestBody @Valid LoginRequest loginRequest) {
        TokenDTO tokens = authenticationService.signIn(loginRequest);

        var refreshToken = tokens.getRefreshToken();

        var validity = loginRequest.getRememberMe()
                ? jwtProperties.getRefreshTokenValidityTimeRememberMe()
                : jwtProperties.getRefreshTokenValidityTime();
        validity = validity / 1000; //to seconds

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false) // TODO: Set to true in production with HTTPS
                .path("/")
                .maxAge(validity)
                .sameSite("Lax")
                .build();

        var response = new Response<LoginResponse>();

        response.setPayload(LoginResponse.builder()
                .token(tokens.getAccessToken())
                .user(tokens.getUser())
                .build());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
    }


    @Operation(summary = "Refresh token endpoint")
    @PostMapping("/refresh")
    public ResponseEntity<Response<LoginResponse>> refresh(HttpServletRequest request) {
        var tokens = authenticationService.refreshToken(request);
        return Response.ok(
                LoginResponse.builder()
                        .token(tokens.getAccessToken())
                        .user(tokens.getUser())
                        .build());
    }

    @Operation(summary = "Logout endpoint")
    @PostMapping("/logout")
    public ResponseEntity<Response<Void>> logout(Authentication authentication, HttpServletRequest request, HttpServletResponse response) {
        this.logoutHandler.logout(request, response, authentication);
        return Response.ok("Logged out successfully");
    }

    @Operation(summary = "Verify user email by confirmation token")
    @PostMapping("/verify-email")
    public ResponseEntity<Response<Void>> verifyEmail(@RequestBody @Valid sn.finawa.dto.authentication.VerifyEmailRequest request) {
        verificationTokenService.verifyToken(request.getToken());
        return Response.ok("Votre compte a été validé avec succès. Vous pouvez maintenant vous connecter.");
    }

    @Operation(summary = "Resend verification email")
    @PostMapping("/resend-verification")
    public ResponseEntity<Response<Void>> resendVerification(@RequestBody @Valid sn.finawa.dto.authentication.ResendVerificationRequest request) {
        verificationTokenService.resendVerificationEmail(request.getEmail());
        return Response.ok("Un nouvel e-mail de confirmation a été envoyé à votre adresse.");
    }

    @Operation(summary = "Request password reset email")
    @PostMapping("/forgot-password")
    public ResponseEntity<Response<Void>> forgotPassword(@RequestBody @Valid sn.finawa.dto.authentication.ForgotPasswordRequest request) {
        passwordResetService.requestPasswordReset(request.getEmail());
        return Response.ok("Si un compte correspond à cette adresse, un e-mail avec les instructions de réinitialisation a été envoyé.");
    }

    @Operation(summary = "Reset password with token")
    @PostMapping("/reset-password")
    public ResponseEntity<Response<Void>> resetPassword(@RequestBody @Valid sn.finawa.dto.authentication.ResetPasswordRequest request) {
        passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
        return Response.ok("Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.");
    }
}
