package com.campuscrib.registration_service.infra.clients.request;

import com.campuscrib.registration_service.domain.model.UserRole;

import java.util.UUID;

public record RegisterUserCredentialsRequest(UUID userId, String email, String passwordHashed, UserRole role) {
}
