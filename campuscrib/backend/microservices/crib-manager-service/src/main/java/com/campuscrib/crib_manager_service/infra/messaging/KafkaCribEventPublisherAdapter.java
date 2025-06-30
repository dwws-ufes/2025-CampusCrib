package com.campuscrib.crib_manager_service.infra.messaging;

import com.campuscrib.crib_manager_service.application.ports.CribEventPublisherPort;
import com.campuscrib.crib_manager_service.domain.events.CribDeletedEvent;
import com.campuscrib.crib_manager_service.domain.events.CribRegisteredEvent;
import com.campuscrib.crib_manager_service.domain.events.CribUpdatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class KafkaCribEventPublisherAdapter implements CribEventPublisherPort {

    private final KafkaTemplate<String, CribRegisteredEvent> kafkaCribRegisteredTemplate;
    private final KafkaTemplate<String, CribUpdatedEvent> kafkaCribUpdatedTemplate;
    private final KafkaTemplate<String, CribDeletedEvent> kafkaCribDeletedTemplate;

    @Value("${kafka.topics.crib-registered}")
    private String cribRegisteredTopic;

    @Value("${kafka.topics.crib-updated}")
    private String cribUpdatedTopic;

    @Value("${kafka.topics.crib-deleted}")
    private String cribDeletedTopic;

    @Override
    public void publishCribRegisteredEvent(CribRegisteredEvent event) {
        kafkaCribRegisteredTemplate.send(cribRegisteredTopic, event);
    }

    @Override
    public void publishCribUpdatedEvent(CribUpdatedEvent event) {
        kafkaCribUpdatedTemplate.send(cribUpdatedTopic, event);
    }

    @Override
    public void publishCribDeletedEventEvent(CribDeletedEvent event) {
        kafkaCribDeletedTemplate.send(cribDeletedTopic, event);
    }
}
