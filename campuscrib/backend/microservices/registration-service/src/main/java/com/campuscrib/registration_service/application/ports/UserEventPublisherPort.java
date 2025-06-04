package com.campuscrib.registration_service.application.ports;

import com.campuscrib.registration_service.application.events.UserRegisteredEvent;

public interface UserEventPublisherPort {
    void publishUserRegisteredEvent(UserRegisteredEvent event);
}
