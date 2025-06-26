package com.campuscrib.registration_service.api.controller;

import com.campuscrib.registration_service.api.dto.RegisterUserRequest;
import com.campuscrib.registration_service.api.dto.ErrorResponse;
import com.campuscrib.registration_service.api.mapper.RegisterMapper;
import com.campuscrib.registration_service.application.ports.RegisterUserUseCase;
import com.campuscrib.registration_service.domain.model.User;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/registration/users")
public class RegisterUserController {

    private final RegisterUserUseCase registerUserUseCase;

    @Autowired
    public RegisterUserController(RegisterUserUseCase registerUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestPart("data") String data,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage
    ) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            RegisterUserRequest request = mapper.readValue(data, RegisterUserRequest.class);

            byte[] profileImageBytes = null;
            if (profileImage != null && !profileImage.isEmpty()) {
                profileImageBytes = profileImage.getBytes();
            }

            String hashedPassword = BCrypt.hashpw(request.getPassword(), BCrypt.gensalt());
            User user = RegisterMapper.toDomain(request, hashedPassword);

            User createdUser = registerUserUseCase.execute(user, profileImageBytes);

            return ResponseEntity.ok(RegisterMapper.toResponse(createdUser));

        } catch (IllegalArgumentException e) {
            ErrorResponse error = ErrorResponse.builder()
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        } catch (Exception e) {
            ErrorResponse error = ErrorResponse.builder()
                    .message("Internal server error")
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
