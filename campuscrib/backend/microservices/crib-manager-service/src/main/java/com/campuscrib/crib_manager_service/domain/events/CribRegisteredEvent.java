package com.campuscrib.crib_manager_service.domain.events;

import com.campuscrib.crib_manager_service.domain.models.AccpetedGender;
import com.campuscrib.crib_manager_service.domain.models.Location;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
public class CribRegisteredEvent {
    private UUID cribId;
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
