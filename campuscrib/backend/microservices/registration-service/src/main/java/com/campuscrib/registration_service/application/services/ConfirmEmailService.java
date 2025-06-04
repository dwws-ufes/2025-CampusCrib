package com.campuscrib.registration_service.application.services;

import com.campuscrib.registration_service.application.ports.AuthenticationServiceClientPort;
import com.campuscrib.registration_service.application.ports.ConfirmEmailUseCase;
import com.campuscrib.registration_service.domain.model.User;
import com.campuscrib.registration_service.domain.ports.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ConfirmEmailService implements ConfirmEmailUseCase {
    private final UserRepository userRepository;
    private final AuthenticationServiceClientPort authenticationServiceClientPort;

    @Autowired
    public ConfirmEmailService(
            UserRepository userRepository,
            AuthenticationServiceClientPort authenticationServiceClientPort
    ) {
        this.userRepository = userRepository;
        this.authenticationServiceClientPort = authenticationServiceClientPort;
    }

    @Override
    public void execute(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.isEmailConfirmed()) {
            return;
        }

        User updatedUser = User.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .passwordHash(user.getPasswordHash())
                .birthDate(user.getBirthDate())
                .role(user.getRole())
                .legalGuardian(user.getLegalGuardian())
                .isEmailConfirmed(true)
                .profileImage(user.getProfileImage())
                .build();

        User savedUser = userRepository.save(updatedUser);

        authenticationServiceClientPort.registerConfirmedUser(savedUser.getId(), savedUser.getEmail(), savedUser.getPasswordHash());
    }
}
