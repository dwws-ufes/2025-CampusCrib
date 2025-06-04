package com.campuscrib.registration_service.application.services;

import com.campuscrib.registration_service.application.ports.ListLegalGuardiansUseCase;
import com.campuscrib.registration_service.domain.model.User;
import com.campuscrib.registration_service.domain.ports.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ListLegalGuardiansService implements ListLegalGuardiansUseCase {
    private final UserRepository userRepository;

    @Autowired
    public ListLegalGuardiansService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    public List<User> execute() {
        LocalDate eighteenYearsAgo = LocalDate.now().minusYears(18);
        return userRepository.findByBirthDateBefore(eighteenYearsAgo);
    }
}
