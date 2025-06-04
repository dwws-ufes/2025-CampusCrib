package com.campuscrib.registration_service.api.mapper;

import com.campuscrib.registration_service.api.dto.LegalGuardianResponse;
import com.campuscrib.registration_service.api.dto.RegisterUserRequest;
import com.campuscrib.registration_service.api.dto.RegisterUserResponse;
import com.campuscrib.registration_service.domain.model.User;

import java.time.LocalDate;

public class UserMapper {

    public static User toDomain(RegisterUserRequest request, String passwordHash) {
        return User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .passwordHash(passwordHash)
                .birthDate(LocalDate.parse(request.getBirthDate()))
                .role(request.getRole())
                .legalGuardian(request.getLegalGuardian())
                .build();
    }

    public static RegisterUserResponse toResponse(User user) {
        return RegisterUserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .birthDate(user.getBirthDate())
                .legalGuardian(user.getLegalGuardian())
                .isEmailConfirmed(user.isEmailConfirmed())
                .profileImage(user.getProfileImage())
                .build();
    }

    public static LegalGuardianResponse toLegalGuardianResponse(User user) {
        return LegalGuardianResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .birthDate(user.getBirthDate())
                .build();
    }
}
