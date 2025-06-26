package com.campuscrib.crib_manager_service.infra.providers;

import com.campuscrib.crib_manager_service.domain.exceptions.InvalidAuthTokenException;
import com.campuscrib.crib_manager_service.domain.models.AuthTokenData;
import com.campuscrib.crib_manager_service.domain.models.UserRole;
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
public class JwtAuthenticationTokenProvider {
    private final SecretKey key;
    private final long expirationMillis;

    public JwtAuthenticationTokenProvider(
            @Value("${jwt.authentication.secret}") String secret,
            @Value("${jwt.authentication.expiration-millis}") long expirationMillis
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMillis = expirationMillis;
    }

    public AuthTokenData parseToken(String token) {
        System.out.println(token);
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
