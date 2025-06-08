package com.campuscrib.authentication_service.infra.repositories;

import com.campuscrib.authentication_service.infra.persistence.UserDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface MongoUserRepository extends MongoRepository<UserDocument, String> {
    Optional<UserDocument> findByEmail(String email);
}
