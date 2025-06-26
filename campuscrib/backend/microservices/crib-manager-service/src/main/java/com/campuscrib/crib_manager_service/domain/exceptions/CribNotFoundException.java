package com.campuscrib.crib_manager_service.domain.exceptions;

public class CribNotFoundException extends RuntimeException {
    public CribNotFoundException() {
        super("Crib not found");
    }
}
