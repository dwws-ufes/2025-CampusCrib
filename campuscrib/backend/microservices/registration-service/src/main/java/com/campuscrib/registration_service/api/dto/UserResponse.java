package com.campuscrib.registration_service.api.dto;

import com.campuscrib.registration_service.domain.model.UserRole;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.UUID;

@Builder
@Getter
public class UserResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private UserRole role;
    private LocalDate birthDate;
    private UUID legalGuardian;
    private String profileImage;
}
