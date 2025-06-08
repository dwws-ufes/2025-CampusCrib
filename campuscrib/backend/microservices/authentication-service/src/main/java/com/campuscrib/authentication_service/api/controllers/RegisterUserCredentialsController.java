package com.campuscrib.authentication_service.api.controllers;

import com.campuscrib.authentication_service.api.dto.RegisterUserCredentialsRequest;
import com.campuscrib.authentication_service.api.mapper.UserCredentialsMapper;
import com.campuscrib.authentication_service.domain.usecases.RegisterUserCredentialsUseCase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/users")
public class RegisterUserCredentialsController {
    private final RegisterUserCredentialsUseCase registerUserCredentialsUseCase;

    @Autowired
    public RegisterUserCredentialsController(RegisterUserCredentialsUseCase registerUserCredentialsUseCase) {
        this.registerUserCredentialsUseCase = registerUserCredentialsUseCase;
    }

    @PostMapping("/register-credentials")
    public ResponseEntity<Void>  registerCredentials(@Validated @RequestBody RegisterUserCredentialsRequest request) {
        registerUserCredentialsUseCase.execute(UserCredentialsMapper.toDomain(request));
        return ResponseEntity.noContent().build();
    }
}
