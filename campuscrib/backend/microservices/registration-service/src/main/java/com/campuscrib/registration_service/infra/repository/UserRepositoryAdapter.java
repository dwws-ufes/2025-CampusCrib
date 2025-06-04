package com.campuscrib.registration_service.infra.repository;

import com.campuscrib.registration_service.domain.model.User;
import com.campuscrib.registration_service.domain.ports.UserRepository;
import com.campuscrib.registration_service.infra.repository.mapper.UserEntityMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class UserRepositoryAdapter implements UserRepository {

    @Autowired
    private JpaUserRepository jpaUserRepository;

    @Override
    public User save(User user) {
        return UserEntityMapper.toDomain(
                jpaUserRepository.save(UserEntityMapper.toEntity(user))
        );
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaUserRepository.findByEmail(email).map(UserEntityMapper::toDomain);
    }

    @Override
    public Optional<User> findById(UUID id) {
        return jpaUserRepository.findById(id).map(UserEntityMapper::toDomain);
    }

    @Override
    public List<User> findByBirthDateBefore(LocalDate date) {
        return jpaUserRepository.findByBirthDateBefore(date).stream()
                .map(UserEntityMapper::toDomain)
                .toList();
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaUserRepository.existsByEmail(email);
    }
}
