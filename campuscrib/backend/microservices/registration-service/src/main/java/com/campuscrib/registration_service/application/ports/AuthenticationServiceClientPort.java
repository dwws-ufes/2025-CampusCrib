package com.campuscrib.registration_service.application.ports;

import com.campuscrib.registration_service.domain.model.UserRole;

import java.util.UUID;

public interface AuthenticationServiceClientPort {
    void registerConfirmedUser(UUID userId, String email, String passwordHashed, UserRole role);
}
