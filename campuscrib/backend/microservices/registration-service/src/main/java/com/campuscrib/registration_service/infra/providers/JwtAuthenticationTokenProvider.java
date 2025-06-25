package com.campuscrib.registration_service.infra.providers;

import com.campuscrib.registration_service.application.ports.AuthenticationTokenProvider;
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
    public UUID parseToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return UUID.fromString(claims.getSubject());
        } catch (JwtException e) {
            throw new IllegalArgumentException("Invalid or expired token");
        }
    }
}
