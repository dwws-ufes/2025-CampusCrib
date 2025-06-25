package com.campuscrib.crib_manager_service.domain.usecases;

import com.campuscrib.crib_manager_service.domain.models.AccpetedGender;
import com.campuscrib.crib_manager_service.domain.models.Crib;
import com.campuscrib.crib_manager_service.domain.models.Location;

import java.math.BigDecimal;
import java.util.UUID;

public interface RegisterCribUseCase {
    Crib execute(
            String title,
            String description,
            AccpetedGender gender,
            Boolean petsPolicy,
            UUID landlordId,
            Integer numberOfRooms,
            Integer numberOfBathrooms,
            Integer numberOfPeopleAlreadyIn,
            Integer numberOfAvailableVacancies,
            BigDecimal price,
            Location location
    );
}