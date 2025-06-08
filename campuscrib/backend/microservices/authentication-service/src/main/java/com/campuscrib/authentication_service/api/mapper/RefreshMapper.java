package com.campuscrib.authentication_service.api.mapper;

import com.campuscrib.authentication_service.api.dto.RefreshRequest;
import com.campuscrib.authentication_service.api.dto.RefreshResponse;
import com.campuscrib.authentication_service.domain.model.LoginAuthentication;
import com.campuscrib.authentication_service.domain.model.UserRefreshToken;

public class RefreshMapper {
    public static UserRefreshToken toDomain(RefreshRequest request) {
        return UserRefreshToken.builder()
                .userId(request.getUserId())
                .refreshToken(request.getRefreshToken())
                .build();
    }

    public static RefreshResponse toResponse(LoginAuthentication loginAuthentication) {
        return RefreshResponse.builder()
                .accessToken(loginAuthentication.getAccessToken())
                .refreshToken(loginAuthentication.getRefreshToken())
                .build();
    }
}
