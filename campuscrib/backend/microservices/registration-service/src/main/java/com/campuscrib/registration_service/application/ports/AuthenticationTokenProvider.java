package com.campuscrib.registration_service.application.ports;

import java.util.UUID;

public interface AuthenticationTokenProvider {
    UUID parseToken(String token);
}
