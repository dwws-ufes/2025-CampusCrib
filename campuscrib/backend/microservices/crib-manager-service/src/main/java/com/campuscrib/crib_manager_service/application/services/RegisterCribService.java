package com.campuscrib.crib_manager_service.application.services;

import com.campuscrib.crib_manager_service.application.ports.CribRepository;
import com.campuscrib.crib_manager_service.domain.models.AccpetedGender;
import com.campuscrib.crib_manager_service.domain.models.Crib;
import com.campuscrib.crib_manager_service.domain.models.Location;
import com.campuscrib.crib_manager_service.domain.usecases.RegisterCribUseCase;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class RegisterCribService implements RegisterCribUseCase {
    private final CribRepository cribRepository;

    public RegisterCribService(CribRepository cribRepository) {
        this.cribRepository = cribRepository;
    }

    @Override
    public Crib execute(String title, String description, AccpetedGender gender, Boolean petsPolicy, UUID landlordId, Integer numberOfRooms, Integer numberOfBathrooms, Integer numberOfPeopleAlreadyIn, Integer numberOfAvailableVacancies, BigDecimal price, Location location) {
        return null;
    }
}
