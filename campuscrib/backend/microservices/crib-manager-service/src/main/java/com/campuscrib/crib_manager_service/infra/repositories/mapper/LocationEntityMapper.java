package com.campuscrib.crib_manager_service.infra.repositories.mapper;

import com.campuscrib.crib_manager_service.domain.models.Location;
import com.campuscrib.crib_manager_service.infra.repositories.entities.LocationEntity;

public class LocationEntityMapper {
    public static Location toDomain(LocationEntity entity) {
        return Location.builder()
                .id(entity.getId())
                .street(entity.getStreet())
                .city(entity.getCity())
                .state(entity.getState())
                .zipCode(entity.getZipCode())
                .latitude(entity.getLatitude())
                .longitude(entity.getLongitude())
                .build();
    }

    public static LocationEntity toEntity(Location domain) {
        return LocationEntity.builder()
                .id(domain.getId())
                .street(domain.getStreet())
                .city(domain.getCity())
                .state(domain.getState())
                .zipCode(domain.getZipCode())
                .latitude(domain.getLatitude())
                .longitude(domain.getLongitude())
                .build();
    }
}