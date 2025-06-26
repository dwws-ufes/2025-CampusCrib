package com.campuscrib.crib_manager_service.application.services;

import com.campuscrib.crib_manager_service.application.ports.CribRepository;
import com.campuscrib.crib_manager_service.domain.models.Crib;
import com.campuscrib.crib_manager_service.domain.usecases.FetchAllMyCribsUseCase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class FetchAllMyCribsService implements FetchAllMyCribsUseCase {
    @Autowired
    private CribRepository cribRepository;

    @Override
    public List<Crib> execute(UUID landlordId) {
        return cribRepository.fetchAll(landlordId);
    }
}
