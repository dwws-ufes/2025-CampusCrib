package com.campuscrib.crib_manager_service.application.ports;

import com.campuscrib.crib_manager_service.domain.models.Crib;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CribRepository {
    Crib save(Crib crib);

    Optional<Crib> findById(UUID id);

    List<Crib> fetchAll(UUID landlordId);

    Boolean delete(UUID id);
}
