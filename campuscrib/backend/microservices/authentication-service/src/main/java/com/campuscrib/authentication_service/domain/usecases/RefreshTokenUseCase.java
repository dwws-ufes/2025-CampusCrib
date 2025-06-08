package com.campuscrib.authentication_service.domain.usecases;

import com.campuscrib.authentication_service.domain.model.LoginAuthentication;
import com.campuscrib.authentication_service.domain.model.UserRefreshToken;

public interface RefreshTokenUseCase {
    LoginAuthentication execute(UserRefreshToken userRefreshToken);
}
