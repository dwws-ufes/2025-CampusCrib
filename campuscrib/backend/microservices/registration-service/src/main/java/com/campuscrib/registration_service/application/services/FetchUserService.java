package com.campuscrib.registration_service.application.services;

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
    public User execute(String accessToken) {
        if (accessToken != null && accessToken.startsWith("Bearer ")) {
            accessToken = accessToken.substring(7);
        }

        UUID userId = authenticationTokenProvider.parseToken(accessToken);
        Optional<User> userFetched = userRepository.findById(userId);
        if(userFetched.isPresent()) {
            return userFetched.get();
        } else {
            throw new IllegalArgumentException("User not found.");
        }
    }
}
