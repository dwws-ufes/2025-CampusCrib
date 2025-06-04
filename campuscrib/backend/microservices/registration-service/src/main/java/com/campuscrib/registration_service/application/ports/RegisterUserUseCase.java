package com.campuscrib.registration_service.application.ports;

import com.campuscrib.registration_service.domain.model.User;

public interface RegisterUserUseCase {
    User execute(User user, byte[] profileImageBytes);
}
