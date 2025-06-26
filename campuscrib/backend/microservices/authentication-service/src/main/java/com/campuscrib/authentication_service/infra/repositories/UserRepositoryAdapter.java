package com.campuscrib.authentication_service.infra.repositories;

import com.campuscrib.authentication_service.application.ports.UserRepository;
import com.campuscrib.authentication_service.domain.model.User;
import com.campuscrib.authentication_service.infra.mapper.UserEntityMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserRepositoryAdapter implements UserRepository {
    @Autowired
    private MongoUserRepository mongoUserRepository;

    @Override
    public Optional<User> findByEmail(String email) {
        return mongoUserRepository.findByEmail(email).map(UserEntityMapper::toDomain);
    }

    @Override
    public Optional<User> findById(String id) {
        return mongoUserRepository.findById(id).map(UserEntityMapper::toDomain);
    }

    @Override
    public void save(User user) {
        mongoUserRepository.save(UserEntityMapper.toEntity(user));
    }

    @Override
    public boolean existsById(String userId) {
        return mongoUserRepository.existsById(userId);
    }
}
