package com.campuscrib.registration_service.domain.ports;

import com.campuscrib.registration_service.domain.model.User;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository {

    User save(User user);

    Optional<User> findByEmail(String email);

    Optional<User> findById(UUID id);

    List<User> findByBirthDateBefore(LocalDate date);

    boolean existsByEmail(String email);
}
