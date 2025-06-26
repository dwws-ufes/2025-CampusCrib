package com.campuscrib.registration_service.infra.filters;

import com.campuscrib.registration_service.domain.model.AuthTokenData;
import com.campuscrib.registration_service.infra.providers.JwtAuthenticationTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtAuthenticationTokenProvider tokenProvider;

    public JwtAuthenticationFilter(JwtAuthenticationTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    private String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if(StringUtils.hasText(bearer)) {
            return bearer.trim();
        }
        return null;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = resolveToken(request);
        if(StringUtils.hasText(token)) {
            try {
                if(token.startsWith("Bearer ")) {
                    token = token.substring(7);
                }
                AuthTokenData authTokenData = tokenProvider.parseToken(token);
                var auth = new UsernamePasswordAuthenticationToken(authTokenData.getUserId(), null, null);
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (IllegalArgumentException ex) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"message\": \"Invalid token\"}");
                return;
            }
        }
        filterChain.doFilter(request, response);
    }
}
