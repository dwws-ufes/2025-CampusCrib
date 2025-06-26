package com.campuscrib.crib_manager_service.api.dto;

import com.campuscrib.crib_manager_service.domain.models.AccpetedGender;
import com.campuscrib.crib_manager_service.domain.models.Location;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UpdateCribRequest {
    private String title;
    private String description;
    private BigDecimal price;
    private Integer numRooms;
    private Integer numBathrooms;
    private Integer numAvailableVacancies;
    private AccpetedGender acceptedGenders;
    private Boolean petsPolicy;
    private Location location;
}
