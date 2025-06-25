package com.campuscrib.authentication_service.api.controllers;

import com.campuscrib.authentication_service.api.dto.LoginRequest;
import com.campuscrib.authentication_service.api.dto.LoginResponse;
import com.campuscrib.authentication_service.api.mapper.LoginMapper;
import com.campuscrib.authentication_service.domain.model.LoginAuthentication;
import com.campuscrib.authentication_service.domain.usecases.LoginUseCase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class LoginController {
    private final LoginUseCase loginUseCase;

    @Autowired
    public LoginController(LoginUseCase loginUseCase) {
        this.loginUseCase = loginUseCase;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Validated @RequestBody LoginRequest request) {
        LoginAuthentication loginAuthentication = loginUseCase.execute(LoginMapper.toDomain(request));
        return ResponseEntity.ok(LoginMapper.toResponse(loginAuthentication));
    }
}
