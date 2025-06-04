package com.campuscrib.registration_service.api.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.UUID;

@Builder
@Getter
public class LegalGuardianResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate birthDate;
}
