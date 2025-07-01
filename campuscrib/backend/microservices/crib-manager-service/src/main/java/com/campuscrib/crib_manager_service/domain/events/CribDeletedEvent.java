package com.campuscrib.crib_manager_service.domain.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class CribDeletedEvent {
    private UUID cribId;
}
