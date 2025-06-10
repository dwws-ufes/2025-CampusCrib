package com.campuscrib.registration_service.infra.clients.request;

import java.util.UUID;

public record RegisterUserCredentialsRequest(UUID userId, String email, String passwordHashed) {
}
