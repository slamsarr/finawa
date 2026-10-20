package sn.finawa.security.services;

import sn.finawa.properties.JwtProperties;
import sn.finawa.repository.TokenRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;


import javax.crypto.SecretKey;
import java.util.*;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JWTService {

    private final JwtProperties jwtProperties;
    private final TokenRepository tokenRepository;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String generateRefreshToken(String username, Boolean rememberMe) {
        var now = System.currentTimeMillis();
        var duration = rememberMe
                ? jwtProperties.getRefreshTokenValidityTimeRememberMe()
                : jwtProperties.getRefreshTokenValidityTime();
        return Jwts.builder()
                .subject(username)
                .issuedAt(getDate(now, 0L))
                .expiration(getDate(now, duration))
                .signWith(getKey())
                .compact();
    }

    public String generateAccessToken(String username) {
        var now = System.currentTimeMillis();
        return Jwts.builder()
                .subject(username)
                .issuedAt(getDate(now, 0L))
                .expiration(getDate(now, jwtProperties.getAccessTokenValidityTime()))
                .signWith(getKey())
                .compact();
    }

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(jwtProperties.getBase64Secret().getBytes());
    }

    private Date getDate(Long start, Long duration) {
        return new Date(start + duration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public boolean validateRefreshToken(String token) {
        return !isTokenExpired(token) && tokenRepository.findByToken(token)
                .map(t -> !t.getExpired() && !t.getRevoked())
                .orElse(false);
    }

    public void revokeAllUserTokens(String username) {
        tokenRepository.revokeTokensByUsername(username);
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

}
