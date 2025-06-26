package com.campuscrib.crib_manager_service.infra.repositories;

import com.campuscrib.crib_manager_service.infra.repositories.entities.CribEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JpaCribRepository extends JpaRepository<CribEntity, UUID> {
    Optional<CribEntity> findById(UUID id);
    List<CribEntity> findAllByLandlordId(UUID landlordId);
}
