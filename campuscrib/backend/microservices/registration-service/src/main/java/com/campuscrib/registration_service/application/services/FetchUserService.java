package com.campuscrib.registration_service.application.services;

import com.campuscrib.registration_service.application.exceptions.UserNotFoundException;
import com.campuscrib.registration_service.application.ports.AuthenticationTokenProvider;
import com.campuscrib.registration_service.application.ports.FetchUserUseCase;
import com.campuscrib.registration_service.domain.model.User;
import com.campuscrib.registration_service.domain.ports.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class FetchUserService implements FetchUserUseCase {
    private final AuthenticationTokenProvider authenticationTokenProvider;
    private final UserRepository userRepository;

    @Autowired
    public FetchUserService(AuthenticationTokenProvider authenticationTokenProvider, UserRepository userRepository) {
        this.authenticationTokenProvider = authenticationTokenProvider;
        this.userRepository = userRepository;
    }


    @Override
    public User execute(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);

    }
}
