package com.campuscrib.crib_manager_service.domain.exceptions;

public class NotMyCribException extends RuntimeException {
    public NotMyCribException() {
        super("You can only see your cribs");
    }
}
