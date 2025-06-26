package com.campuscrib.crib_manager_service.api.controller;

import com.campuscrib.crib_manager_service.api.dto.CribResponse;
import com.campuscrib.crib_manager_service.api.mapper.CribMapper;
import com.campuscrib.crib_manager_service.domain.models.Crib;
import com.campuscrib.crib_manager_service.domain.usecases.FetchCribUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/manager/cribs")
public class FetchCribController {
    private final FetchCribUseCase fetchCribUseCase;

    public FetchCribController(FetchCribUseCase fetchCribUseCase) {
        this.fetchCribUseCase = fetchCribUseCase;
    }

    @GetMapping("crib/{id}")
    public ResponseEntity<CribResponse> fetchCrib(@PathVariable UUID id, Authentication authentication) {
        UUID landlordId = (UUID) authentication.getPrincipal();
        Crib cribFetched = fetchCribUseCase.execute(id, landlordId);
        return ResponseEntity.ok(CribMapper.toResponse(cribFetched));
    }
}
