package com.campuscrib.authentication_service.application.services;

import com.campuscrib.authentication_service.application.ports.RefreshTokenCacheRepository;
import com.campuscrib.authentication_service.application.ports.TokenServicePort;
import com.campuscrib.authentication_service.domain.exceptions.InvalidRefreshTokenException;
import com.campuscrib.authentication_service.domain.model.LoginAuthentication;
import com.campuscrib.authentication_service.domain.model.UserRefreshToken;
import com.campuscrib.authentication_service.domain.usecases.RefreshTokenUseCase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RefreshTokenService implements RefreshTokenUseCase {
    private final RefreshTokenCacheRepository refreshTokenCacheRepository;
    private final TokenServicePort tokenServicePort;

    @Autowired
    public RefreshTokenService(RefreshTokenCacheRepository refreshTokenCacheRepository,
                               TokenServicePort tokenServicePort) {
        this.refreshTokenCacheRepository = refreshTokenCacheRepository;
        this.tokenServicePort = tokenServicePort;
    }

    @Override
    public LoginAuthentication execute(UserRefreshToken userRefreshToken) {
        String storedRefreshToken = refreshTokenCacheRepository.getRefreshToken(userRefreshToken.getUserId());

        if (storedRefreshToken == null || !storedRefreshToken.equals(userRefreshToken.getRefreshToken())) {
            throw new InvalidRefreshTokenException();
        }

        String newAccessToken = tokenServicePort.generateAccessToken(userRefreshToken.getUserId());
        String newRefreshToken = tokenServicePort.generateRefreshToken();

        refreshTokenCacheRepository.storeRefreshToken(userRefreshToken.getUserId(), newRefreshToken);

        return LoginAuthentication.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }
}
