package sn.finawa.service;

import jakarta.servlet.http.HttpServletRequest;
import sn.finawa.dto.authentication.LoginRequest;
import sn.finawa.dto.authentication.TokenDTO;

public interface AuthenticationService {
    TokenDTO signIn(LoginRequest userLoginDTO);

    TokenDTO refreshToken(HttpServletRequest request);
}
