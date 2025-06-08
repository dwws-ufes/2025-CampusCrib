package com.campuscrib.authentication_service.domain.model;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class User {
    private String id;
    private String email;
    private String passwordHashed;
}
