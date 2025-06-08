package com.campuscrib.authentication_service.domain.usecases;

import com.campuscrib.authentication_service.domain.model.User;

public interface RegisterUserCredentialsUseCase {
    void execute(User user);
}
