package com.campuscrib.authentication_service.api.dto;

import com.campuscrib.authentication_service.domain.model.UserRole;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class RegisterUserCredentialsRequest {
    @NotBlank
    private String userId;

    @NotBlank
    private String email;

    @NotBlank
    private String passwordHashed;

    @NotBlank
    private UserRole role;
}
