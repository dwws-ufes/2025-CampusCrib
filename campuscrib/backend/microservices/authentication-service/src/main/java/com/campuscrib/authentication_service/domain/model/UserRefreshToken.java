package com.campuscrib.authentication_service.domain.model;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class UserRefreshToken {
    private String userId;
    private String refreshToken;
}
