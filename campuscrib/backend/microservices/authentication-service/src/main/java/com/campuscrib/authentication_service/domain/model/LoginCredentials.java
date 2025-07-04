package com.campuscrib.authentication_service.domain.model;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class LoginCredentials {
    private String email;
    private String password;
}
