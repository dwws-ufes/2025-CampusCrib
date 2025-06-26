package com.campuscrib.crib_manager_service.infra.repositories;

import com.campuscrib.crib_manager_service.application.ports.CribRepository;
import com.campuscrib.crib_manager_service.domain.models.Crib;
import com.campuscrib.crib_manager_service.infra.repositories.mapper.CribEntityMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class CribRepositoryAdapter implements CribRepository {
    private final JpaCribRepository jpaCribRepository;

    public CribRepositoryAdapter(JpaCribRepository jpaCribRepository) {
        this.jpaCribRepository = jpaCribRepository;
    }

    @Override
    public Crib save(Crib crib) {
        return CribEntityMapper.toDomain(
            jpaCribRepository.save(CribEntityMapper.toEntity(crib))
        );
    }

    @Override
    public Optional<Crib> findById(UUID id) {
        return jpaCribRepository.findById(id).map(CribEntityMapper::toDomain);
    }

    @Override
    public List<Crib> fetchAll(UUID landlordId) {
        return jpaCribRepository.findAllByLandlordId(landlordId).stream().map(CribEntityMapper::toDomain).toList();
    }

    @Override
    public void deleteById(UUID id) {
        jpaCribRepository.deleteById(id);
    }
}
