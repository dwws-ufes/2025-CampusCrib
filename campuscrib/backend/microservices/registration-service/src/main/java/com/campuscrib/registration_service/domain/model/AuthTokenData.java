package com.campuscrib.registration_service.domain.model;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Builder
@Getter
public class AuthTokenData {
    private UUID userId;
    private UserRole role;
}
