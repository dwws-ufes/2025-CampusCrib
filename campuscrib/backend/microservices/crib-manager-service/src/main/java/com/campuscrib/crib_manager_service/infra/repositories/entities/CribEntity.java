package com.campuscrib.crib_manager_service.infra.repositories.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "cribs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CribEntity {
    @Id
    @NotNull
    private UUID id;

    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private AccpetedGenderEntity gender;

    private Boolean petsPolicy;

    @Column(name = "landlord_id")
    private UUID landlordId;

    private Integer numberOfRooms;
    private Integer numberOfBathrooms;
    private Integer numberOfPeopleAlreadyIn;
    private Integer numberOfAvailableVacancies;

    private BigDecimal price;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", referencedColumnName = "id")
    private LocationEntity location;

    private List<String> images;
}
