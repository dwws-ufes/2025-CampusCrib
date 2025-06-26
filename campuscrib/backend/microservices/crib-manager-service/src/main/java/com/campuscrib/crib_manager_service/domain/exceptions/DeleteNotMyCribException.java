package com.campuscrib.crib_manager_service.domain.exceptions;

public class DeleteNotMyCribException extends RuntimeException {
    public DeleteNotMyCribException() {
        super("You can only delete your own crib");
    }
}
