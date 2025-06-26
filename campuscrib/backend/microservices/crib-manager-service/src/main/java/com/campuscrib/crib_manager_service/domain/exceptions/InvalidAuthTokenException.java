package com.campuscrib.crib_manager_service.domain.exceptions;

public class InvalidAuthTokenException extends RuntimeException {
    public InvalidAuthTokenException(String message) {
        super(message);
    }
}
