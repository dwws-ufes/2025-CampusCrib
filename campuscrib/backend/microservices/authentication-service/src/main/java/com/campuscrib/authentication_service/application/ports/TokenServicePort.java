package com.campuscrib.authentication_service.application.ports;

import com.campuscrib.authentication_service.domain.model.LoginAuthentication;

public interface TokenServicePort {
    String generateAccessToken(String userId);
    String generateRefreshToken();
    String getSubject(String token);
}
