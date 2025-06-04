package com.campuscrib.registration_service.application.services;

import com.campuscrib.registration_service.application.events.UserRegisteredEvent;
import com.campuscrib.registration_service.application.ports.EmailConfirmationTokenProvider;
import com.campuscrib.registration_service.application.ports.UserEventPublisherPort;
import com.campuscrib.registration_service.application.ports.MediaServiceClientPort;
import com.campuscrib.registration_service.application.ports.RegisterUserUseCase;
import com.campuscrib.registration_service.domain.model.User;
import com.campuscrib.registration_service.domain.model.UserRole;
import com.campuscrib.registration_service.domain.ports.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class RegisterUserService implements RegisterUserUseCase {

    private final UserRepository userRepository;
    private final MediaServiceClientPort mediaServiceClientPort;
    private final UserEventPublisherPort userEventPublisherPort;
    private final EmailConfirmationTokenProvider emailConfirmationTokenProvider;

    @Autowired
    public RegisterUserService(
            UserRepository userRepository,
            MediaServiceClientPort mediaServiceClientPort,
            UserEventPublisherPort userEventPublisherPort,
            EmailConfirmationTokenProvider emailConfirmationTokenProvider
    ) {
        this.userRepository = userRepository;
        this.mediaServiceClientPort = mediaServiceClientPort;
        this.userEventPublisherPort = userEventPublisherPort;
        this.emailConfirmationTokenProvider = emailConfirmationTokenProvider;
    }

    @Override
    public User execute(User user, byte[] profileImageBytes) {
        if(userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }

        if (user.getRole() == UserRole.TENANT && isUnderage(user.getBirthDate())) {
            if (user.getLegalGuardian() == null) {
                throw new IllegalArgumentException("Legal guardian is required for underage tenants.");
            }
        }

        User userToSave = User.builder()
                .id(UUID.randomUUID())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .isEmailConfirmed(false)
                .passwordHash(user.getPasswordHash())
                .birthDate(user.getBirthDate())
                .profileImage(user.getProfileImage())
                .role(user.getRole())
                .legalGuardian(user.getLegalGuardian())
                .build();

        User savedUser = userRepository.save(userToSave);

        if (profileImageBytes != null && profileImageBytes.length > 0) {
            String imageUrl = mediaServiceClientPort.uploadProfileImage(savedUser.getId(), profileImageBytes);

            savedUser = userRepository.save(
                    User.builder()
                            .id(savedUser.getId())
                            .firstName(savedUser.getFirstName())
                            .lastName(savedUser.getLastName())
                            .email(savedUser.getEmail())
                            .passwordHash(savedUser.getPasswordHash())
                            .birthDate(savedUser.getBirthDate())
                            .role(savedUser.getRole())
                            .legalGuardian(savedUser.getLegalGuardian())
                            .isEmailConfirmed(savedUser.isEmailConfirmed())
                            .profileImage(imageUrl)
                            .build()
            );
        }

        String confirmationToken = emailConfirmationTokenProvider.generateToken(savedUser.getId());
        UserRegisteredEvent event = new UserRegisteredEvent(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                confirmationToken
        );

        userEventPublisherPort.publishUserRegisteredEvent(event);

        return savedUser;
    }

    private boolean isUnderage(LocalDate birthDate) {
        return birthDate.isAfter(LocalDate.now().minusYears(18));
    }
}
