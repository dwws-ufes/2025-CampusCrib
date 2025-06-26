package com.campuscrib.crib_manager_service.infra.repositories.mapper;

import com.campuscrib.crib_manager_service.domain.models.AccpetedGender;
import com.campuscrib.crib_manager_service.domain.models.Crib;
import com.campuscrib.crib_manager_service.infra.repositories.entities.AccpetedGenderEntity;
import com.campuscrib.crib_manager_service.infra.repositories.entities.CribEntity;

public class CribEntityMapper {
    public static CribEntity toEntity(Crib crib) {
        return CribEntity.builder()
                .id(crib.getId())
                .title(crib.getTitle())
                .description(crib.getDescription())
                .gender(AccpetedGenderEntity.valueOf(crib.getGender().name()))
                .petsPolicy(crib.getPetsPolicy())
                .landlordId(crib.getLandlordId())
                .numberOfRooms(crib.getNumberOfRooms())
                .numberOfBathrooms(crib.getNumberOfBathrooms())
                .numberOfPeopleAlreadyIn(crib.getNumberOfPeopleAlreadyIn())
                .numberOfAvailableVacancies(crib.getNumberOfAvailableVacancies())
                .price(crib.getPrice())
                .location(LocationEntityMapper.toEntity(crib.getLocation()))
                .images(crib.getImages())
                .build();
    }

    public static Crib toDomain(CribEntity entity) {
        return Crib.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .gender(AccpetedGender.valueOf(entity.getGender().name()))
                .petsPolicy(entity.getPetsPolicy())
                .landlordId(entity.getLandlordId())
                .numberOfRooms(entity.getNumberOfRooms())
                .numberOfBathrooms(entity.getNumberOfBathrooms())
                .numberOfPeopleAlreadyIn(entity.getNumberOfPeopleAlreadyIn())
                .numberOfAvailableVacancies(entity.getNumberOfAvailableVacancies())
                .price(entity.getPrice())
                .location(LocationEntityMapper.toDomain(entity.getLocation()))
                .images(entity.getImages())
                .build();
    }
}
