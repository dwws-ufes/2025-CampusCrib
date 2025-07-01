package kafka

import (
	"context"
	"crib-search-service/domain/models"
	"crib-search-service/domain/repository"
	"encoding/json"
	"log"

	"github.com/segmentio/kafka-go"
)

type CribConsumer struct {
	reader *kafka.Reader
	repo   repository.CribRepository
	topic  string
}

func NewCribConsumer(brokers []string, topic, groupId string, repo repository.CribRepository) *CribConsumer {
	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers: brokers,
		Topic:   topic,
		GroupID: groupId,
	})
	return &CribConsumer{
		reader: reader,
		repo:   repo,
		topic:  topic,
	}
}

func (c *CribConsumer) StartConsuming(ctx context.Context) error {
	log.Printf("📡 Listening to topic %s...\n", c.topic)
	for {
		m, err := c.reader.ReadMessage(ctx)
		if err != nil {
			log.Printf("Error reading message from Kafka: %v\n", err)
			return err
		}

		go func(m kafka.Message) {
			var crib models.Crib
			if err := json.Unmarshal(m.Value, &crib); err != nil {
				log.Printf("Error desserializing event: %v\n", err)
				return
			}

			switch c.topic {
			case "crib.registered":
				err = c.repo.Save(ctx, &crib)
			case "crib.updated":
				err = c.repo.Update(ctx, &crib)
			case "crib.deleted":
				err = c.repo.Delete(ctx, crib.ID)
			}

			if err != nil {
				log.Printf("❌ Erro processing crib (%s): %v\n", c.topic, err)
			} else {
				log.Printf("✅ Event processed: %s - Crib ID %s\n", c.topic, crib.ID.String())
			}
		}(m)
	}
}

func (c *CribConsumer) Close() error {
	return c.reader.Close()
}
