package com.campuscrib.registration_service.infra.providers;

import com.campuscrib.registration_service.application.exceptions.InvalidAuthTokenException;
import com.campuscrib.registration_service.application.ports.AuthenticationTokenProvider;
import com.campuscrib.registration_service.domain.model.AuthTokenData;
import com.campuscrib.registration_service.domain.model.UserRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
public class JwtAuthenticationTokenProvider implements AuthenticationTokenProvider {

    private final SecretKey key;
    private final long expirationMillis;

    public JwtAuthenticationTokenProvider(
            @Value("${jwt.authentication.secret}") String secret,
            @Value("${jwt.authentication.expiration-millis}") long expirationMillis
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMillis = expirationMillis;
    }

    @Override
    public AuthTokenData parseToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return AuthTokenData.builder()
                    .userId(UUID.fromString(claims.getSubject()))
                    .role(UserRole.valueOf(claims.get("role", String.class)))
                    .build();
        } catch (JwtException e) {
            e.printStackTrace();
            throw new InvalidAuthTokenException("Invalid or expired token");
        }
    }
}
