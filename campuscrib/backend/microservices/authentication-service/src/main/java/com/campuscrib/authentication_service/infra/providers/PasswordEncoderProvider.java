package com.campuscrib.authentication_service.infra.providers;

import com.campuscrib.authentication_service.application.ports.PasswordEncoderPort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordEncoderProvider implements PasswordEncoderPort {
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public PasswordEncoderProvider(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public String encode(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    @Override
    public boolean matches(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
