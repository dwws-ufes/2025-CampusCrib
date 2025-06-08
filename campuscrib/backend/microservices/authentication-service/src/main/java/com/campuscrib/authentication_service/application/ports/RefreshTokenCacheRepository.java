package com.campuscrib.authentication_service.application.ports;

public interface RefreshTokenCacheRepository {
    void storeRefreshToken(String userId, String refreshToken);
    String getRefreshToken(String userId);
    void deleteRefreshToken(String userId);
}
