package com.campuscrib.crib_manager_service.domain.models;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Builder
@Getter
public class Crib {
    private UUID id;
    private String title;
    private String description;
    private AccpetedGender gender;
    private Boolean petsPolicy;
    private UUID landlordId;
    private Integer numberOfRooms;
    private Integer numberOfBathrooms;
    private Integer numberOfPeopleAlreadyIn;
    private Integer numberOfAvailableVacancies;
    private BigDecimal price;
    private Location location;
    private List<String> images;
}
