package com.campuscrib.registration_service.infra.messaging;

import com.campuscrib.registration_service.application.events.UserRegisteredEvent;
import com.campuscrib.registration_service.application.ports.UserEventPublisherPort;
import org.springframework.stereotype.Service;

@Service
public class UserEventPublishedKafkaAdapter implements UserEventPublisherPort {

    @Override
    public void publishUserRegisteredEvent(UserRegisteredEvent event) {
        // Will be implemented
    }
}
