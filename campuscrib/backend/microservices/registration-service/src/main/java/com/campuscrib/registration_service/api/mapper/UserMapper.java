package com.campuscrib.registration_service.api.mapper;

import com.campuscrib.registration_service.api.dto.UserResponse;
import com.campuscrib.registration_service.domain.model.User;

public class UserMapper {
    public static UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .birthDate(user.getBirthDate())
                .legalGuardian(user.getLegalGuardian())
                .profileImage(user.getProfileImage())
                .build();
    }
}
