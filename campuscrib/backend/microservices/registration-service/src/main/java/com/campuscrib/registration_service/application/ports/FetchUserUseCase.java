package com.campuscrib.registration_service.application.ports;

import com.campuscrib.registration_service.domain.model.User;

public interface FetchUserUseCase {
    User execute(String accessToken);
}
