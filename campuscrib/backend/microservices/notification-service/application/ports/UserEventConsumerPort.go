package ports

import (
	"context"
)

type UserEventConsumerPort interface {
	StartConsuming(ctx context.Context, handler func(UserRegisteredEvent) error) error
}
