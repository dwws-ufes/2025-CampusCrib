package com.campuscrib.registration_service.application.ports;

import com.campuscrib.registration_service.domain.model.AuthTokenData;


public interface AuthenticationTokenProvider {
    AuthTokenData parseToken(String token);
}
