package com.campuscrib.authentication_service.domain.usecases;

import com.campuscrib.authentication_service.domain.model.LoginAuthentication;
import com.campuscrib.authentication_service.domain.model.LoginCredentials;

public interface LoginUseCase {
    LoginAuthentication execute(LoginCredentials loginCredentials);
}
