package sn.finawa.service.impl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import sn.finawa.annotation.Journal;
import sn.finawa.dto.UserResponse;
import sn.finawa.entity.TokenEntity;
import sn.finawa.entity.UserEntity;
import sn.finawa.exception.*;
import sn.finawa.exception.InternalError;
import sn.finawa.mapper.ProfileMapper;
import sn.finawa.dto.authentication.LoginRequest;
import sn.finawa.dto.authentication.TokenDTO;
import sn.finawa.repository.TokenRepository;
import sn.finawa.repository.UserRepository;
import sn.finawa.security.SecurityUtils;
import sn.finawa.security.services.JWTService;
import sn.finawa.service.AuthenticationService;
import sn.finawa.aspect.ActionType;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final JWTService tokenService;
    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final ProfileMapper profileMapper;


    @Override
    @Journal(actionType = ActionType.SIGN_IN)
    public TokenDTO signIn(LoginRequest userLoginDto) {
        var username = userLoginDto.getLogin();
        var user = getUser(username);
        if (!user.getActive()) {
            throw new UserDisabledException("Votre compte n'est pas encore activé. Veuillez confirmer votre adresse email pour vous connecter.");
        }

        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(username, userLoginDto.getPassword());

        Authentication auth = authenticationManager.authenticate(token);
        if (auth.isAuthenticated()) {
            if (user.isFirstAttempt()) {
                // TODO : If there's extra logic for first time connexions
                user.setFirstAttempt(false);
                user = userRepository.save(user);
            }
            tokenService.revokeAllUserTokens(username); // Only Refresh tokens are saved.
            String refreshToken = tokenService.generateRefreshToken(username, userLoginDto.getRememberMe());
            TokenEntity tokenEntity = TokenEntity.builder()
                    .token(refreshToken)
                    .user(user)
                    .expired(false)
                    .revoked(false)
                    .build();
            tokenRepository.save(tokenEntity);

            String accessToken = tokenService.generateAccessToken(username);


            return TokenDTO.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .user(UserResponse
                            .builder()
                            .login(user.getLogin())
                            .profile(profileMapper.asDto(user.getProfile()))
                            .active(user.getActive())
                            .build())
                    .build();
        }
        throw new InternalError("An error occurred during the process of authentication");
    }

    @Override
    public TokenDTO refreshToken(HttpServletRequest request) {
        String refreshToken = SecurityUtils.extractRefreshToken(request);
        if (refreshToken != null && !refreshToken.isEmpty() && tokenService.validateRefreshToken(refreshToken)) {
            String username = tokenService.extractUsername(refreshToken);
            var user = getUser(username);
            var newAccessToken = tokenService.generateAccessToken(username);
            return TokenDTO.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(refreshToken)
                    .user(UserResponse
                            .builder()
                            .login(user.getLogin())
                            .profile(profileMapper.asDto(user.getProfile()))
                            .active(user.getActive())
                            .build())
                    .build();
        }
        throw new UnauthorizedException("Refresh token is missing or couldn't be processed");
    }

    private UserEntity getUser(String username) {
        return userRepository
                .findByLogin(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with login : " + username));
    }
}
