package com.campuscrib.registration_service.application.ports;

import java.util.UUID;

public interface ConfirmEmailUseCase {
    void execute(UUID userId);
}
