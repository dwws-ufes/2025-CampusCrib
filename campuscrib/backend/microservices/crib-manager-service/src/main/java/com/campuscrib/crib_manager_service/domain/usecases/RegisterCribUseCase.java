package com.campuscrib.crib_manager_service.domain.usecases;

import com.campuscrib.crib_manager_service.domain.models.Crib;

public interface RegisterCribUseCase {
    Crib execute(Crib crib);
}