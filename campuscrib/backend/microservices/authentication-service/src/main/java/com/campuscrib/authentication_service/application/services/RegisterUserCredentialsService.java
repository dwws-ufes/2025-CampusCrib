package com.campuscrib.authentication_service.application.services;

import com.campuscrib.authentication_service.application.ports.UserRepository;
import com.campuscrib.authentication_service.domain.exceptions.DuplicateEmailException;
import com.campuscrib.authentication_service.domain.exceptions.UserPersistenceException;
import com.campuscrib.authentication_service.domain.model.User;
import com.campuscrib.authentication_service.domain.usecases.RegisterUserCredentialsUseCase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RegisterUserCredentialsService implements RegisterUserCredentialsUseCase {
    private final UserRepository userRepository;

    @Autowired
    public RegisterUserCredentialsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void execute(User user) {
        boolean userExists = userRepository.existsById(user.getId());

        if (!userExists) {
            try {
                userRepository.save(user);
            } catch (org.springframework.dao.DuplicateKeyException e) {
                throw new DuplicateEmailException("Email '" + user.getEmail() + "' is already registered");
            } catch (Exception e) {
                throw new UserPersistenceException(e);
            }
        }
    }
}
