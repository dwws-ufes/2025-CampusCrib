package com.campuscrib.authentication_service.api.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class RefreshResponse {
    private String accessToken;
    private String refreshToken;
}
