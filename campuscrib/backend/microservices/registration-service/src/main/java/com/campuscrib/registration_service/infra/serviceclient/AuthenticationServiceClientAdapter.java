package com.campuscrib.registration_service.infra.serviceclient;

import com.campuscrib.registration_service.application.ports.AuthenticationServiceClientPort;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthenticationServiceClientAdapter implements AuthenticationServiceClientPort {
    @Override
    public void registerConfirmedUser(UUID userId, String email, String passwordHashed) {
        // Will be implemented
    }
}
