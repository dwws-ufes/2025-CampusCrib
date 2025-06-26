package com.campuscrib.crib_manager_service.domain.usecases;

import com.campuscrib.crib_manager_service.api.dto.UpdateCribRequest;
import com.campuscrib.crib_manager_service.domain.models.Crib;

import java.util.UUID;

public interface UpdateCribUseCase {
    Crib execute(UUID cribId, UUID landlordId, UpdateCribRequest request);
}
