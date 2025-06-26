package com.campuscrib.crib_manager_service.domain.usecases;

import com.campuscrib.crib_manager_service.domain.models.Crib;

import java.util.UUID;

public interface FetchCribUseCase {
    Crib execute(UUID cribId, UUID requesterId);
}
