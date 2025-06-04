package com.campuscrib.registration_service.application.ports;

import java.util.UUID;

public interface MediaServiceClientPort {
        String uploadProfileImage(UUID userId, byte[] imageBytes);
}
