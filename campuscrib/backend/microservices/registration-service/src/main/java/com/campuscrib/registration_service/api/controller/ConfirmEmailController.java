package com.campuscrib.registration_service.api.controller;

import com.campuscrib.registration_service.application.ports.ConfirmEmailUseCase;
import com.campuscrib.registration_service.application.ports.EmailConfirmationTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/registration/users")
public class ConfirmEmailController {
    private final ConfirmEmailUseCase confirmEmailUseCase;
    private final EmailConfirmationTokenProvider emailConfirmationTokenProvider;

    @Autowired
    public ConfirmEmailController(ConfirmEmailUseCase confirmEmailUseCase,
                                  EmailConfirmationTokenProvider emailConfirmationTokenProvider) {
        this.confirmEmailUseCase = confirmEmailUseCase;
        this.emailConfirmationTokenProvider = emailConfirmationTokenProvider;
    }

    @GetMapping("confirm-email")
    public ResponseEntity<?> confirmEmail(@RequestParam("token") String token) {
        try {
            UUID userId = emailConfirmationTokenProvider.parseToken(token);
            confirmEmailUseCase.execute(userId);
            return ResponseEntity.ok("Email confirmed successfully!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
