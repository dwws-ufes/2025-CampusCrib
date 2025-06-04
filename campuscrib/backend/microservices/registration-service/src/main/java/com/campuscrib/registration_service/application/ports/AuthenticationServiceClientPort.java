package com.campuscrib.registration_service.application.ports;

import java.util.UUID;

public interface AuthenticationServiceClientPort {
    void registerConfirmedUser(UUID userId, String email, String passwordHashed);
}
