package com.campuscrib.registration_service.api.dto;

import com.campuscrib.registration_service.domain.model.UserRole;
import lombok.Getter;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
public class RegisterUserRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Email
    @NotBlank
    private String email;

    @Size(min = 8)
    @NotBlank
    private String password;

    @NotBlank
    private UserRole role;

    @NotBlank
    private String birthDate;

    private UUID legalGuardian;
}
