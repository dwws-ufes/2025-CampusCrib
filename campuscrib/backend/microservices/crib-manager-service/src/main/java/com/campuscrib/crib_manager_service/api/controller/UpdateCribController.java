package com.campuscrib.crib_manager_service.api.controller;

import com.campuscrib.crib_manager_service.api.dto.CribResponse;
import com.campuscrib.crib_manager_service.api.dto.UpdateCribRequest;
import com.campuscrib.crib_manager_service.api.mapper.CribMapper;
import com.campuscrib.crib_manager_service.domain.models.Crib;
import com.campuscrib.crib_manager_service.domain.usecases.UpdateCribUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/manager/cribs")
public class UpdateCribController {
    private final UpdateCribUseCase updateCribUseCase;

    public UpdateCribController(UpdateCribUseCase updateCribUseCase) {
        this.updateCribUseCase = updateCribUseCase;
    }

    @PatchMapping("/crib/{id}")
    public ResponseEntity<CribResponse> updateCrib(@PathVariable UUID id,
                                                   @RequestBody UpdateCribRequest request,
                                                   Authentication authentication) {
        UUID landlordId = (UUID) authentication.getPrincipal();
        Crib cribUpdated = updateCribUseCase.execute(id, landlordId, request);
        return ResponseEntity.ok(CribMapper.toResponse(cribUpdated));
    }
}
