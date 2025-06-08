package com.campuscrib.authentication_service.application.ports;

import com.campuscrib.authentication_service.domain.model.User;

import java.util.Optional;

public interface UserRepository {
    Optional<User> findByEmail(String email);
    void save(User user);
    boolean existsById(String userId);
}
