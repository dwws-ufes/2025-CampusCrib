package com.campuscrib.crib_manager_service.api.mapper;

import com.campuscrib.crib_manager_service.api.dto.RegisterCribRequest;
import com.campuscrib.crib_manager_service.api.dto.RegisterCribResponse;
import com.campuscrib.crib_manager_service.domain.models.Crib;

import java.util.UUID;

public class RegisterCribMapper {
    static public Crib toDomain(RegisterCribRequest request, UUID landLordId) {
        return Crib.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .gender(request.getAcceptedGenders())
                .petsPolicy(request.getPetsPolicy())
                .landlordId(landLordId)
                .numberOfRooms(request.getNumRooms())
                .numberOfBathrooms(request.getNumBathrooms())
                .numberOfAvailableVacancies(request.getNumAvailableVacancies())
                .price(request.getPrice())
                .location(request.getLocation())
                .build();
    }

    static public RegisterCribResponse toResponse(Crib crib) {
        return RegisterCribResponse.builder()
                .id(crib.getId())
                .title(crib.getTitle())
                .description(crib.getDescription())
                .landlordId(crib.getLandlordId())
                .price(crib.getPrice())
                .numRooms(crib.getNumberOfRooms())
                .numBathrooms(crib.getNumberOfBathrooms())
                .numPeopleAlreadyIn(crib.getNumberOfPeopleAlreadyIn())
                .numAvailableVacancies(crib.getNumberOfAvailableVacancies())
                .acceptedGenders(crib.getGender())
                .petsPolicy(crib.getPetsPolicy())
                .location(crib.getLocation())
                .build();
    }
}