package com.campuscrib.registration_service.api.handlers;

import com.campuscrib.registration_service.api.dto.ErrorResponse;
import com.campuscrib.registration_service.application.exceptions.EmailAlreadyConfirmedException;
import com.campuscrib.registration_service.application.exceptions.ExternalServiceException;
import com.campuscrib.registration_service.application.exceptions.UserPersistenceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(EmailAlreadyConfirmedException.class)
    public ResponseEntity<ErrorResponse> handleEmailAlreadyConfirmed(EmailAlreadyConfirmedException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .message(ex.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(UserPersistenceException.class)
    public ResponseEntity<ErrorResponse> handlePersistence(UserPersistenceException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .message(ex.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(ExternalServiceException.class)
    public ResponseEntity<ErrorResponse> handleExternal(ExternalServiceException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .message(ex.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegal(IllegalArgumentException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .message(ex.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(Exception ex) {
        ErrorResponse error = ErrorResponse.builder()
                .message(ex.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
