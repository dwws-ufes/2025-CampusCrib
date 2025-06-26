package com.campuscrib.crib_manager_service.api.controller;

import com.campuscrib.crib_manager_service.api.dto.CribResponse;
import com.campuscrib.crib_manager_service.api.mapper.CribMapper;
import com.campuscrib.crib_manager_service.domain.usecases.FetchAllMyCribsUseCase;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/manager/cribs")
public class AllMyCribsController {
    private final FetchAllMyCribsUseCase fetchAllMyCribsUseCase;

    public AllMyCribsController(FetchAllMyCribsUseCase fetchAllMyCribsUseCase) {
        this.fetchAllMyCribsUseCase = fetchAllMyCribsUseCase;
    }

    @GetMapping("all-my")
    public List<CribResponse> listAllMyCribs(Authentication authentication) {
        UUID landlordId = (UUID) authentication.getPrincipal();
        return fetchAllMyCribsUseCase.execute(landlordId)
                .stream()
                .map(CribMapper::toResponse)
                .toList();
    }
}
