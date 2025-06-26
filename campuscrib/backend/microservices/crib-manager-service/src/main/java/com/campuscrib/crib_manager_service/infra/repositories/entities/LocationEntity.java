package com.campuscrib.crib_manager_service.infra.repositories.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "locations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String city;
    private String state;
    private String street;
    private String zipCode;
    private Double latitude;
    private Double longitude;
}
