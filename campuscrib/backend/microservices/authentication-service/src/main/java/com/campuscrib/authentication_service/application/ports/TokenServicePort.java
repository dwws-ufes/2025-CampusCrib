package com.campuscrib.authentication_service.application.ports;

import com.campuscrib.authentication_service.domain.model.LoginAuthentication;
import com.campuscrib.authentication_service.domain.model.UserRole;

public interface TokenServicePort {
    String generateAccessToken(String userId, UserRole role);
    String generateRefreshToken();
    String getSubject(String token);
}
