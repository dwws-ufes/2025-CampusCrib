package com.campuscrib.crib_manager_service.api.dto;

import com.campuscrib.crib_manager_service.domain.models.AccpetedGender;
import com.campuscrib.crib_manager_service.domain.models.Location;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.UUID;

@Builder
@Getter
public class CribResponse {
    private UUID id;
    private String title;
    private String description;
    private UUID landlordId;
    private BigDecimal price;
    private Integer numRooms;
    private Integer numBathrooms;
    private Integer numPeopleAlreadyIn;
    private Integer numAvailableVacancies;
    private AccpetedGender acceptedGenders;
    private Boolean petsPolicy;
    private Location location;
}
