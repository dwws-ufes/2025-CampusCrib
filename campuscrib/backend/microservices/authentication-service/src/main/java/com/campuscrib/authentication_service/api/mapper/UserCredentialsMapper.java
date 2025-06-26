package com.campuscrib.authentication_service.api.mapper;

import com.campuscrib.authentication_service.api.dto.RegisterUserCredentialsRequest;
import com.campuscrib.authentication_service.domain.model.User;

public class UserCredentialsMapper {
    public static User toDomain(RegisterUserCredentialsRequest request) {
        return User.builder()
                .id(request.getUserId())
                .email(request.getEmail())
                .passwordHashed(request.getPasswordHashed())
                .role(request.getRole())
                .build();
    }
}
