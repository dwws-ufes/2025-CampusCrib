package com.campuscrib.authentication_service.api.mapper;

import com.campuscrib.authentication_service.api.dto.LoginRequest;
import com.campuscrib.authentication_service.api.dto.LoginResponse;
import com.campuscrib.authentication_service.domain.model.LoginAuthentication;
import com.campuscrib.authentication_service.domain.model.LoginCredentials;

public class LoginMapper {
    public static LoginCredentials toDomain(LoginRequest request) {
        return LoginCredentials.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .build();
    }

    public static LoginResponse toResponse(LoginAuthentication loginAuthentication) {
        return LoginResponse.builder()
                .accessToken(loginAuthentication.getAccessToken())
                .refreshToken(loginAuthentication.getRefreshToken())
                .build();
    }
}
