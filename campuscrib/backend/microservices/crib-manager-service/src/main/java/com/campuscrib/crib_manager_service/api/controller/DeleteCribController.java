package com.campuscrib.crib_manager_service.api.controller;

import com.campuscrib.crib_manager_service.domain.usecases.DeleteCribUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import java.util.UUID;

@RestController
@RequestMapping("/api/manager/cribs")
public class DeleteCribController {
    private final DeleteCribUseCase deleteCribUseCase;

    public DeleteCribController(DeleteCribUseCase deleteCribUseCase) {
        this.deleteCribUseCase = deleteCribUseCase;
    }

    @DeleteMapping("crib/{id}")
    public ResponseEntity<Void> deleteCrib(
            @PathVariable UUID id,
            Authentication authentication) {
        UUID landlordId = (UUID) authentication.getPrincipal();
        deleteCribUseCase.execute(id, landlordId);
        return ResponseEntity.noContent().build();
    }
}
