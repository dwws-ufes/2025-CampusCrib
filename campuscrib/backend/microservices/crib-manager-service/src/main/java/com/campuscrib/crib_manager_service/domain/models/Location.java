package com.campuscrib.crib_manager_service.domain.models;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Builder
@Getter
public class Location {
    private UUID id;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private Double latitude;
    private Double longitude;
}