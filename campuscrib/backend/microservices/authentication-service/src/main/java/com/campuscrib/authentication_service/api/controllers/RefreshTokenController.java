package com.campuscrib.authentication_service.api.controllers;

import com.campuscrib.authentication_service.api.dto.RefreshRequest;
import com.campuscrib.authentication_service.api.dto.RefreshResponse;
import com.campuscrib.authentication_service.api.mapper.RefreshMapper;
import com.campuscrib.authentication_service.domain.model.LoginAuthentication;
import com.campuscrib.authentication_service.domain.usecases.RefreshTokenUseCase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class RefreshTokenController {
    private final RefreshTokenUseCase refreshTokenUseCase;

    @Autowired
    public RefreshTokenController(RefreshTokenUseCase refreshTokenUseCase) {
        this.refreshTokenUseCase = refreshTokenUseCase;
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshResponse> refresh(@Validated @RequestBody RefreshRequest request) {
        LoginAuthentication loginAuthentication = refreshTokenUseCase.execute(RefreshMapper.toDomain(request));
        return ResponseEntity.ok(RefreshMapper.toResponse(loginAuthentication));
    }
}
