package com.campuscrib.crib_manager_service.domain.events;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class CribDeletedEvent {
    private UUID cribId;
}
