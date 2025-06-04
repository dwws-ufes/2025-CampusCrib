package com.campuscrib.registration_service.infra.repository;

import com.campuscrib.registration_service.infra.repository.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JpaUserRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByEmail(String email);
    List<UserEntity> findByBirthDateBefore(LocalDate date);
    boolean existsByEmail(String email);
}
