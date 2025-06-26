package com.campuscrib.authentication_service.infra.mapper;

import com.campuscrib.authentication_service.domain.model.User;
import com.campuscrib.authentication_service.domain.model.UserRole;
import com.campuscrib.authentication_service.infra.persistence.UserDocument;

public class UserEntityMapper {
    public static UserDocument toEntity(User user) {
        return UserDocument.builder()
                .id(user.getId())
                .email(user.getEmail())
                .passwordHashed(user.getPasswordHashed())
                .role(user.getRole().name())
                .build();
    }

    public static User toDomain(UserDocument entity) {
        return User.builder()
                .id(entity.getId())
                .email(entity.getEmail())
                .passwordHashed(entity.getPasswordHashed())
                .role(UserRole.valueOf(entity.getRole()))
                .build();
    }
}
