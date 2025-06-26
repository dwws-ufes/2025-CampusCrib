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
    public Crib execute(Crib crib) {
        Crib cribToSave = Crib.builder()
                .id(UUID.randomUUID())
                .title(crib.getTitle())
                .description(crib.getDescription())
                .gender(crib.getGender())
                .petsPolicy(crib.getPetsPolicy())
                .landlordId(crib.getLandlordId())
                .numberOfRooms(crib.getNumberOfRooms())
                .numberOfBathrooms(crib.getNumberOfBathrooms())
                .numberOfAvailableVacancies(crib.getNumberOfAvailableVacancies())
                .numberOfPeopleAlreadyIn(0)
                .price(crib.getPrice())
                .location(crib.getLocation())
                .build();

        return cribRepository.save(cribToSave);
    }
}
