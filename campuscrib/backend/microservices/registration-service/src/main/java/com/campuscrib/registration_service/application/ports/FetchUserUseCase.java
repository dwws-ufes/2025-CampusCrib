package com.campuscrib.registration_service.application.ports;

import com.campuscrib.registration_service.domain.model.User;

import java.util.UUID;

public interface FetchUserUseCase {
    User execute(UUID userId);
}
