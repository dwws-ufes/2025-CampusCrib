package com.campuscrib.crib_manager_service.api.dto;

import com.campuscrib.crib_manager_service.domain.models.AccpetedGender;
import com.campuscrib.crib_manager_service.domain.models.Location;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

@Getter
public class RegisterCribRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private Integer numRooms;

    @NotNull
    private Integer numBathrooms;

    @NotNull
    private Integer numAvailableVacancies;

    @NotNull
    private BigDecimal price;

    @NotNull
    private AccpetedGender acceptedGenders;

    @NotNull
    private Boolean petsPolicy;

    @NotNull
    private Location location;
}