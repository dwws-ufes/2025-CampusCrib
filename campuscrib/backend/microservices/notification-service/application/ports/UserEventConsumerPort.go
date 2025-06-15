package ports

import (
	"context"

	"github.com/dwws-ufes/2025-CampusCrib/campuscrib/backend/microservices/notification-service/domain/events"
)

type UserEventConsumerPort interface {
	StartConsuming(ctx context.Context, handler func(events.UserRegisteredEvent) error) error
}
