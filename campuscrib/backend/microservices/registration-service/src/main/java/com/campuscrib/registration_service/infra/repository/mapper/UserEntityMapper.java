package com.campuscrib.registration_service.infra.repository.mapper;

import com.campuscrib.registration_service.domain.model.User;
import com.campuscrib.registration_service.domain.model.UserRole;
import com.campuscrib.registration_service.infra.repository.entity.UserEntity;
import com.campuscrib.registration_service.infra.repository.entity.UserRoleEntity;

public class UserEntityMapper {

    public static UserEntity toEntity(User user) {
        return UserEntity.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .isEmailConfirmed(user.isEmailConfirmed())
                .passwordHash(user.getPasswordHash())
                .birthDate(user.getBirthDate())
                .profileImage(user.getProfileImage())
                .role(UserRoleEntity.valueOf(user.getRole().name()))
                .legalGuardian(user.getLegalGuardian())
                .build();
    }

    public static User toDomain(UserEntity entity) {
        return User.builder()
                .id(entity.getId())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .email(entity.getEmail())
                .isEmailConfirmed(entity.isEmailConfirmed())
                .passwordHash(entity.getPasswordHash())
                .birthDate(entity.getBirthDate())
                .profileImage(entity.getProfileImage())
                .role(UserRole.valueOf(entity.getRole().name()))
                .legalGuardian(entity.getLegalGuardian())
                .build();
    }
}