package com.campuscrib.authentication_service.api.dto;

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
}
