package com.campuscrib.authentication_service.domain.model;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class LoginAuthentication {
    private String accessToken;
    private String refreshToken;
}
