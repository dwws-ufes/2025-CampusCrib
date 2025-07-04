package com.campuscrib.crib_manager_service.api.controller;

import com.campuscrib.crib_manager_service.api.dto.RegisterCribRequest;
import com.campuscrib.crib_manager_service.api.dto.RegisterCribResponse;
import com.campuscrib.crib_manager_service.api.mapper.RegisterCribMapper;
import com.campuscrib.crib_manager_service.domain.models.Crib;
import com.campuscrib.crib_manager_service.domain.usecases.RegisterCribUseCase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.validation.annotation.Validated;
import org.springframework.security.core.Authentication;

import java.util.UUID;

@RestController
@RequestMapping("/api/manager/cribs")
public class RegisterCribController {
    private final RegisterCribUseCase registerCribUseCase;

    @Autowired
    public RegisterCribController(RegisterCribUseCase registerCribUseCase) {
        this.registerCribUseCase = registerCribUseCase;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterCribResponse> register(
            @Validated @RequestBody RegisterCribRequest request,
            Authentication authentication
    ) {
        System.out.println(request);
        UUID landlordId = (UUID) authentication.getPrincipal();
        Crib cribCreated = registerCribUseCase.execute(RegisterCribMapper.toDomain(request, landlordId));

        return ResponseEntity.ok(RegisterCribMapper.toResponse(cribCreated));
    }
}
