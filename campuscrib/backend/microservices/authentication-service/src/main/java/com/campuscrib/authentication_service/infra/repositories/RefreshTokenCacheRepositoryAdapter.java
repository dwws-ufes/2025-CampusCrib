package com.campuscrib.authentication_service.infra.repositories;

import com.campuscrib.authentication_service.application.ports.RefreshTokenCacheRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RefreshTokenCacheRepositoryAdapter implements RefreshTokenCacheRepository {
    private final RedisTemplate<String, String> redisTemplate;

    private static final Duration REFRESH_TOKEN_TTL = Duration.ofDays(7);

    @Autowired
    public RefreshTokenCacheRepositoryAdapter(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void storeRefreshToken(String userId, String refreshToken) {
        redisTemplate.opsForValue().set(buildKey(userId), refreshToken, REFRESH_TOKEN_TTL);
    }

    @Override
    public String getRefreshToken(String userId) {
        return redisTemplate.opsForValue().get(buildKey(userId));
    }

    @Override
    public void deleteRefreshToken(String userId) {
        redisTemplate.delete(buildKey(userId));
    }

    private String buildKey(String userId) {
        return "auth:refresh:" + userId;
    }
}
