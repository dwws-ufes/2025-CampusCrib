package com.campuscrib.registration_service.infra.repository.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {

    @Id
    private UUID id;

    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String email;

    private boolean isEmailConfirmed;

    private String passwordHash;

    private LocalDate birthDate;

    private String profileImage;

    @Enumerated(EnumType.STRING)
    private UserRoleEntity role;

    @Column(name = "legal_guardian_id")
    private UUID legalGuardianId;
}
