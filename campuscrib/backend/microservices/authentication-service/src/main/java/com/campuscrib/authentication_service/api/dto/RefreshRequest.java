package com.campuscrib.authentication_service.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class RefreshRequest {
    @NotBlank
    private String userId;

    @NotBlank
    private String refreshToken;
}
