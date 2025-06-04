package com.campuscrib.registration_service.infra.serviceclient;

import com.campuscrib.registration_service.application.ports.MediaServiceClientPort;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MediaServiceClientAdapter implements MediaServiceClientPort {
    @Override
    public String uploadProfileImage(UUID userId, byte[] imageBytes) {
        // Will be implemented
        return "";
    }
}
