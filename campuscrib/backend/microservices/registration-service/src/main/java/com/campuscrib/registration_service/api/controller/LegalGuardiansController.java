package com.campuscrib.registration_service.api.controller;

import com.campuscrib.registration_service.api.dto.LegalGuardianResponse;
import com.campuscrib.registration_service.api.mapper.RegisterMapper;
import com.campuscrib.registration_service.application.ports.ListLegalGuardiansUseCase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/registration/users")
public class LegalGuardiansController {
    private final ListLegalGuardiansUseCase listLegalGuardiansUseCase;

    @Autowired
    public LegalGuardiansController(ListLegalGuardiansUseCase listLegalGuardiansUseCase) {
        this.listLegalGuardiansUseCase = listLegalGuardiansUseCase;
    }

    @GetMapping("/legal-guardians")
    public List<LegalGuardianResponse> listLegalGuardians() {
        return listLegalGuardiansUseCase.execute()
                .stream()
                .map(RegisterMapper::toLegalGuardianResponse)
                .toList();
    }
}
