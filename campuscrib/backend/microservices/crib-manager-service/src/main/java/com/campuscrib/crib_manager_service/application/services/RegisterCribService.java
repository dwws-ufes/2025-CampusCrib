package com.campuscrib.crib_manager_service.application.services;

import com.campuscrib.crib_manager_service.application.ports.CribEventPublisherPort;
import com.campuscrib.crib_manager_service.application.ports.CribRepository;
import com.campuscrib.crib_manager_service.domain.events.CribRegisteredEvent;
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
    private final CribEventPublisherPort cribEventPublisherPort;

    public RegisterCribService(CribRepository cribRepository, CribEventPublisherPort cribEventPublisherPort) {
        this.cribRepository = cribRepository;
        this.cribEventPublisherPort = cribEventPublisherPort;
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

        Crib cribSaved = cribRepository.save(cribToSave);

        CribRegisteredEvent registeredEvent = new CribRegisteredEvent(
                cribSaved.getId(),
                cribSaved.getTitle(),
                cribSaved.getDescription(),
                cribSaved.getGender(),
                cribSaved.getPetsPolicy(),
                cribSaved.getLandlordId(),
                cribSaved.getNumberOfRooms(),
                cribSaved.getNumberOfBathrooms(),
                cribSaved.getNumberOfPeopleAlreadyIn(),
                cribSaved.getNumberOfAvailableVacancies(),
                cribSaved.getPrice(),
                cribSaved.getLocation(),
                cribSaved.getImages()
        );

        cribEventPublisherPort.publishCribRegisteredEvent(registeredEvent);

        return cribSaved;
    }
}
