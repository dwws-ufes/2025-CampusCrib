package com.campuscrib.registration_service.domain.model;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.UUID;

@Builder
@Getter
public class User {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private boolean isEmailConfirmed;
    private String passwordHash;
    private LocalDate birthDate;
    private String profileImage;
    private UserRole role;
    private UUID legalGuardian;

    public String getFullName() {
        return this.firstName + " " + this.lastName;
    }
}
