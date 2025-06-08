package com.campuscrib.authentication_service.application.services;

import com.campuscrib.authentication_service.application.ports.PasswordEncoderPort;
import com.campuscrib.authentication_service.application.ports.RefreshTokenCacheRepository;
import com.campuscrib.authentication_service.application.ports.TokenServicePort;
import com.campuscrib.authentication_service.application.ports.UserRepository;
import com.campuscrib.authentication_service.domain.exceptions.InvalidCredentialsException;
import com.campuscrib.authentication_service.domain.model.LoginAuthentication;
import com.campuscrib.authentication_service.domain.model.LoginCredentials;
import com.campuscrib.authentication_service.domain.model.User;
import com.campuscrib.authentication_service.domain.usecases.LoginUseCase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginService implements LoginUseCase {
    private final UserRepository userRepository;
    private final PasswordEncoderPort passwordEncoderPort;
    private final TokenServicePort tokenServicePort;
    private final RefreshTokenCacheRepository refreshTokenCacheRepository;

    @Autowired
    public LoginService(UserRepository userRepository,
                        PasswordEncoderPort passwordEncoderPort,
                        TokenServicePort tokenServicePort,
                        RefreshTokenCacheRepository refreshTokenCacheRepository) {
        this.userRepository = userRepository;
        this.passwordEncoderPort = passwordEncoderPort;
        this.tokenServicePort = tokenServicePort;
        this.refreshTokenCacheRepository = refreshTokenCacheRepository;
    }

    @Override
    public LoginAuthentication execute(LoginCredentials loginCredentials) {
        User user = userRepository.findByEmail(loginCredentials.getEmail()).orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoderPort.matches(loginCredentials.getPassword(), user.getPasswordHashed())) {
            throw new InvalidCredentialsException();
        }

        String accessToken = tokenServicePort. generateAccessToken(user.getId());
        String refreshToken = tokenServicePort.generateRefreshToken();

        refreshTokenCacheRepository.storeRefreshToken(user.getId(), refreshToken);

        return LoginAuthentication.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
}
