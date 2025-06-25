package com.campuscrib.registration_service.api.controller;

import com.campuscrib.registration_service.api.dto.UserResponse;
import com.campuscrib.registration_service.api.mapper.UserMapper;
import com.campuscrib.registration_service.application.ports.FetchUserUseCase;
import com.campuscrib.registration_service.domain.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/registration/users")
public class FetchUserController {

    private final FetchUserUseCase fetchUserUseCase;

    @Autowired
    public FetchUserController(FetchUserUseCase fetchUserUseCase) {
        this.fetchUserUseCase = fetchUserUseCase;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> fetchUser(@RequestHeader("Authorization") String authorization) {
        User user = fetchUserUseCase.execute(authorization);
        return ResponseEntity.ok(UserMapper.toResponse(user));
    }
}
