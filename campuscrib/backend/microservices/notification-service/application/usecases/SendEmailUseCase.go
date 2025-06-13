package usecases

import "github.com/dwws-ufes/2025-CampusCrib/campuscrib/backend/microservices/notification-service/application/ports"

type SendEmailUseCase struct {
	emailSender ports.EmailSenderPort
}

func NewSendEmailUseCase(sender ports.EmailSenderPort) *SendEmailUseCase {
	return &SendNotificationUseCase{emailSender: sender}
}

func (u *SendEmailUseCase) Handle(event UserRegisteredEvent) error {
	subject := "Confirme seu e-mail para o CampusCrib"
	body := "Teste"
	return u.emailSender.SendEmail(event.Email, subject, body)
}
