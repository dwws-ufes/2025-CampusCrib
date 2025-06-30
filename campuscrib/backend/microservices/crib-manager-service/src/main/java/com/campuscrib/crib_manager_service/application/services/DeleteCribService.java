package com.campuscrib.crib_manager_service.application.services;

import com.campuscrib.crib_manager_service.application.ports.CribEventPublisherPort;
import com.campuscrib.crib_manager_service.application.ports.CribRepository;
import com.campuscrib.crib_manager_service.domain.events.CribDeletedEvent;
import com.campuscrib.crib_manager_service.domain.exceptions.CribNotFoundException;
import com.campuscrib.crib_manager_service.domain.exceptions.DeleteNotMyCribException;
import com.campuscrib.crib_manager_service.domain.models.Crib;
import com.campuscrib.crib_manager_service.domain.usecases.DeleteCribUseCase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DeleteCribService implements DeleteCribUseCase {
    @Autowired
    private CribRepository cribRepository;

    @Autowired
    private CribEventPublisherPort cribEventPublisherPort;

    @Override
    public void execute(UUID cribId, UUID requesterId) {
        Crib crib = cribRepository.findById(cribId)
                .orElseThrow(CribNotFoundException::new);

        if (!crib.getLandlordId().equals(requesterId)) {
            throw new DeleteNotMyCribException();
        }

        cribRepository.deleteById(crib.getId());

        CribDeletedEvent deletedEvent = new CribDeletedEvent(cribId);
        cribEventPublisherPort.publishCribDeletedEventEvent(deletedEvent);
    }
}
