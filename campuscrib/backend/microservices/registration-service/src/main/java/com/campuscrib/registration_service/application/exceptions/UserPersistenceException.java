package com.campuscrib.registration_service.application.exceptions;

public class UserPersistenceException extends RuntimeException {
    public  UserPersistenceException(String message, Throwable cause) {
        super(message, cause);
    }
}
