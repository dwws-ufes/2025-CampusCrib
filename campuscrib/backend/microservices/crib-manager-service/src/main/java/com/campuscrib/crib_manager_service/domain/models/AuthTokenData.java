package com.campuscrib.crib_manager_service.domain.models;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Builder
@Getter
public class AuthTokenData {
    private UUID userId;
    private UserRole role;
}
