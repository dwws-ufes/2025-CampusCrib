package com.campuscrib.crib_manager_service.domain.usecases;

import com.campuscrib.crib_manager_service.domain.models.Crib;

import java.util.List;
import java.util.UUID;

public interface FetchAllMyCribsUseCase {
    List<Crib> execute(UUID landlordId);
}
