package com.campuscrib.registration_service.infra.clients;

import com.campuscrib.registration_service.application.ports.AuthenticationServiceClientPort;
import com.campuscrib.registration_service.domain.model.UserRole;
import com.campuscrib.registration_service.infra.clients.request.RegisterUserCredentialsRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthenticationServiceClientAdapter implements AuthenticationServiceClientPort {
    private final AuthenticationServiceFeignClient client;

    @Autowired
    public AuthenticationServiceClientAdapter(AuthenticationServiceFeignClient client) {
        this.client = client;
    }

    @Override
    public void registerConfirmedUser(UUID userId, String email, String passwordHashed, UserRole role) {
        client.registerUserCredentials(new RegisterUserCredentialsRequest(userId, email, passwordHashed, role));
    }
}
