package com.campuscrib.authentication_service.domain.exceptions;

public class UserPersistenceException extends RuntimeException {
    public UserPersistenceException(Throwable cause) {
        super("Error saving user", cause);
    }
}
