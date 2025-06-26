package com.campuscrib.crib_manager_service.api.mapper;

import com.campuscrib.crib_manager_service.api.dto.CribResponse;
import com.campuscrib.crib_manager_service.domain.models.Crib;

public class CribMapper {
    public static CribResponse toResponse(Crib domain) {
        return CribResponse.builder()
                .id(domain.getId())
                .title(domain.getTitle())
                .description(domain.getDescription())
                .landlordId(domain.getLandlordId())
                .price(domain.getPrice())
                .numRooms(domain.getNumberOfRooms())
                .numBathrooms(domain.getNumberOfBathrooms())
                .numPeopleAlreadyIn(domain.getNumberOfPeopleAlreadyIn())
                .numAvailableVacancies(domain.getNumberOfAvailableVacancies())
                .acceptedGenders(domain.getGender())
                .petsPolicy(domain.getPetsPolicy())
                .location(domain.getLocation())
                .build();
    }
}
