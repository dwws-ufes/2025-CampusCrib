package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/dwws-ufes/2025-CampusCrib/campuscrib/backend/microservices/notification-service/application/usecases"
	"github.com/dwws-ufes/2025-CampusCrib/campuscrib/backend/microservices/notification-service/infra/consumers"
	"github.com/dwws-ufes/2025-CampusCrib/campuscrib/backend/microservices/notification-service/infra/mail"
	"github.com/joho/godotenv"
	"github.com/segmentio/kafka-go"
)

func main() {
	if os.Getenv("ENV") != "production" {
		if err := godotenv.Load(); err != nil {
			log.Println("⚠️ Não foi possível carregar o .env local.")
		}
	}

	kafkaBroker := os.Getenv("KAFKA_BROKER")
	kafkaTopic := os.Getenv("KAFKA_TOPIC")
	kafkaGroupId := os.Getenv("KAFKA_GROUP_ID")
	sesRegion := os.Getenv("AWS_SES_REGION")
	sesSourceEmail := os.Getenv("AWS_SES_SOURCE_EMAIL")

	if kafkaBroker == "" || kafkaTopic == "" || kafkaGroupId == "" || sesRegion == "" || sesSourceEmail == "" {
		log.Fatal("Variáveis de ambiente faltando.")
	}

	emailSender, err := mail.NewSesEmailSenderAdapter(sesRegion, sesSourceEmail)
	if err != nil {
		log.Fatalf("Erro ao iniciar o adaptador SES: %v", err)
	}

	sendEmailUseCase := usecases.NewSendEmailUseCase(emailSender)

	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{kafkaBroker},
		Topic:   kafkaTopic,
		GroupID: kafkaGroupId,
	})

	consumer := consumers.NewKafkaUserEventConsumerAdapter(reader, sendEmailUseCase.Handle)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go func() {
		if err := consumer.StartConsuming(ctx); err != nil {
			log.Fatalf("Erro ao consumir eventos: %v", err)
		}
	}()

	log.Println("📬 Notification Service iniciado. Aguardando eventos...")

	sig := make(chan os.Signal, 1)
	signal.Notify(sig, os.Interrupt, syscall.SIGTERM)
	<-sig
	log.Println("Encerrando Notification Service.")
}
