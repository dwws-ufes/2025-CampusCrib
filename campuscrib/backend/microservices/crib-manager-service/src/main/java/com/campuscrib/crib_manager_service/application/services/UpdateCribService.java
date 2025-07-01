package com.campuscrib.crib_manager_service.application.services;

import com.campuscrib.crib_manager_service.api.dto.UpdateCribRequest;
import com.campuscrib.crib_manager_service.application.ports.CribEventPublisherPort;
import com.campuscrib.crib_manager_service.application.ports.CribRepository;
import com.campuscrib.crib_manager_service.domain.events.CribUpdatedEvent;
import com.campuscrib.crib_manager_service.domain.exceptions.CribNotFoundException;
import com.campuscrib.crib_manager_service.domain.exceptions.NotMyCribException;
import com.campuscrib.crib_manager_service.domain.models.AccpetedGender;
import com.campuscrib.crib_manager_service.domain.models.Crib;
import com.campuscrib.crib_manager_service.domain.models.Location;
import com.campuscrib.crib_manager_service.domain.usecases.UpdateCribUseCase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class UpdateCribService implements UpdateCribUseCase {
    @Autowired
    private CribRepository cribRepository;

    @Autowired
    private CribEventPublisherPort cribEventPublisherPort;

    @Override
    public Crib execute(UUID cribId, UUID landlordId, UpdateCribRequest request) {
        Crib crib = cribRepository.findById(cribId)
                .orElseThrow(CribNotFoundException::new);

        if(!crib.getLandlordId().equals(landlordId)) {
            throw new NotMyCribException();
        }

        if(request.getTitle() != null) crib.setTitle(request.getTitle());
        if(request.getDescription() != null) crib.setDescription(request.getDescription());
        if(request.getPrice() != null) crib.setPrice(request.getPrice());
        if(request.getNumRooms() != null) crib.setNumberOfRooms(request.getNumRooms());
        if(request.getNumBathrooms() != null) crib.setNumberOfBathrooms(request.getNumBathrooms());
        if(request.getNumAvailableVacancies() != null) crib.setNumberOfAvailableVacancies(request.getNumAvailableVacancies());
        if(request.getAcceptedGenders() != null) crib.setGender(request.getAcceptedGenders());
        if(request.getPetsPolicy() != null) crib.setPetsPolicy(request.getPetsPolicy());
        if(request.getLocation() != null) crib.setLocation(request.getLocation());

        Crib cribSaved = cribRepository.save(crib);

        CribUpdatedEvent updatedEvent = CribUpdatedEvent.builder()
                .cribId(cribSaved.getId())
                .title(cribSaved.getTitle())
                .description(cribSaved.getDescription())
                .gender(cribSaved.getGender())
                .petsPolicy(cribSaved.getPetsPolicy())
                .landlordId(cribSaved.getLandlordId())
                .numberOfRooms(cribSaved.getNumberOfRooms())
                .numberOfBathrooms(cribSaved.getNumberOfBathrooms())
                .numberOfPeopleAlreadyIn(cribSaved.getNumberOfPeopleAlreadyIn())
                .numberOfAvailableVacancies(cribSaved.getNumberOfAvailableVacancies())
                .price(cribSaved.getPrice())
                .location(cribSaved.getLocation())
                .images(cribSaved.getImages())
                .build();

        cribEventPublisherPort.publishCribUpdatedEvent(updatedEvent);

        return cribSaved;
    }
}
