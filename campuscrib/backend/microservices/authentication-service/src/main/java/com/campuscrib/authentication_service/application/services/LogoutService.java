package com.campuscrib.authentication_service.application.services;

import com.campuscrib.authentication_service.application.ports.RefreshTokenCacheRepository;
import com.campuscrib.authentication_service.domain.usecases.LogoutUseCase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LogoutService implements LogoutUseCase {
    private final RefreshTokenCacheRepository refreshTokenCacheRepository;

    @Autowired
    public LogoutService(RefreshTokenCacheRepository refreshTokenCacheRepository) {
        this.refreshTokenCacheRepository = refreshTokenCacheRepository;
    }

    @Override
    public void execute(String userId) {
        refreshTokenCacheRepository.deleteRefreshToken(userId);
    }
}
