package com.campuscrib.registration_service.infra.messaging;

import com.campuscrib.registration_service.application.events.UserRegisteredEvent;
import com.campuscrib.registration_service.application.ports.UserEventPublisherPort;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class KafkaUserEventPublisherAdapter implements UserEventPublisherPort {

    private final KafkaTemplate<String, UserRegisteredEvent> kafkaTemplate;

    @Value("${kafka.topics.user-registered}")
    private String userRegisteredTopic;

    @Override
    public void publishUserRegisteredEvent(UserRegisteredEvent event) {
        kafkaTemplate.send(userRegisteredTopic, event);
    }
}
