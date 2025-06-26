package com.campuscrib.crib_manager_service.domain.usecases;

import java.util.UUID;

public interface DeleteCribUseCase {
    void execute(UUID cribId, UUID requesterId);
}
