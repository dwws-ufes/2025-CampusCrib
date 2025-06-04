package com.campuscrib.registration_service.application.ports;

import java.util.UUID;

public interface EmailConfirmationTokenProvider {
    String generateToken(UUID userId);
    UUID parseToken(String token);
}
