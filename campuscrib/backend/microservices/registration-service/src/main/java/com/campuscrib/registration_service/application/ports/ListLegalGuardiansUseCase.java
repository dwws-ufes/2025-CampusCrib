package com.campuscrib.registration_service.application.ports;

import com.campuscrib.registration_service.domain.model.User;

import java.util.List;

public interface ListLegalGuardiansUseCase {
    List<User> execute();
}
