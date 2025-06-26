package com.campuscrib.crib_manager_service.application.services;

import com.campuscrib.crib_manager_service.application.ports.CribRepository;
import com.campuscrib.crib_manager_service.domain.exceptions.CribNotFoundException;
import com.campuscrib.crib_manager_service.domain.exceptions.DeleteNotMyCribException;
import com.campuscrib.crib_manager_service.domain.exceptions.NotMyCribException;
import com.campuscrib.crib_manager_service.domain.models.Crib;
import com.campuscrib.crib_manager_service.domain.usecases.FetchCribUseCase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class FetchCribService implements FetchCribUseCase {
    @Autowired
    private CribRepository cribRepository;


    @Override
    public Crib execute(UUID cribId, UUID requesterId) {
        Crib crib = cribRepository.findById(cribId)
                .orElseThrow(CribNotFoundException::new);

        if (!crib.getLandlordId().equals(requesterId)) {
            throw new NotMyCribException();
        }

        return crib;
    }
}
