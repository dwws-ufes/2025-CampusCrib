package com.campuscrib.crib_manager_service.application.ports;

import com.campuscrib.crib_manager_service.domain.events.CribDeletedEvent;
import com.campuscrib.crib_manager_service.domain.events.CribRegisteredEvent;
import com.campuscrib.crib_manager_service.domain.events.CribUpdatedEvent;

public interface CribEventPublisherPort {
    void publishCribRegisteredEvent(CribRegisteredEvent event);
    void publishCribUpdatedEvent(CribUpdatedEvent event);
    void publishCribDeletedEventEvent(CribDeletedEvent event);
}
