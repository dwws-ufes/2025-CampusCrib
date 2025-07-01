package consumers

import (
	"context"
	"encoding/json"
	"log"

	"github.com/dwws-ufes/2025-CampusCrib/campuscrib/backend/microservices/notification-service/domain/events"
	"github.com/segmentio/kafka-go"
)

type KafkaUserEventConsumerAdapter struct {
	Reader  *kafka.Reader
	Handler func(ctx context.Context, event events.UserRegisteredEvent) error
}

func NewKafkaUserEventConsumerAdapter(reader *kafka.Reader, handler func(ctx context.Context, event events.UserRegisteredEvent) error) *KafkaUserEventConsumerAdapter {
	return &KafkaUserEventConsumerAdapter{
		Reader:  reader,
		Handler: handler,
	}
}

func (kf *KafkaUserEventConsumerAdapter) StartConsuming(ctx context.Context) error {
	for {
		msg, err := kf.Reader.ReadMessage(ctx)
		if err != nil {
			log.Printf("Error reading message from Kafka: %v\n", err)
			continue
		}

		var event events.UserRegisteredEvent
		if err := json.Unmarshal(msg.Value, &event); err != nil {
			log.Printf("Error desserializing event: %v\n", err)
			continue
		}

		if err := kf.Handler(ctx, event); err != nil {
			log.Printf("Error processing event: %v\n", err)
		} else {
			log.Printf("✅ Event processed: %s - Email %s\n", event.Email)
		}
	}
}
