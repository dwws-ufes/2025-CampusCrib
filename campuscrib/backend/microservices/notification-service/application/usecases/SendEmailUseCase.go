package usecases

import (
	"context"
	"fmt"

	"github.com/dwws-ufes/2025-CampusCrib/campuscrib/backend/microservices/notification-service/application/ports"
	"github.com/dwws-ufes/2025-CampusCrib/campuscrib/backend/microservices/notification-service/domain/events"
)

type SendEmailUseCase struct {
	emailSender ports.EmailSenderPort
}

func NewSendEmailUseCase(sender ports.EmailSenderPort) *SendEmailUseCase {
	return &SendEmailUseCase{emailSender: sender}
}

func (u *SendEmailUseCase) Handle(ctx context.Context, event events.UserRegisteredEvent) error {
	subject := "Confirme seu e-mail para o CampusCrib"

	body := fmt.Sprintf(`
<html>
  <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
      <h2 style="color: #333;">Bem-vindo ao CampusCrib, %s! 🎉</h2>
      <p>Estamos felizes em ter você conosco!</p>
      <p>Por favor, confirme seu e-mail clicando no botão abaixo:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:8080/api/registration/users/confirm-email?token=%s" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">Confirmar e-mail</a>
      </div>
      <p>Se você não realizou esse cadastro, apenas ignore esta mensagem.</p>
      <p>Com carinho,</p>
      <p><strong>Equipe CampusCrib</strong></p>
    </div>
  </body>
</html>
`, event.FullName, event.ConfirmationToken)
	return u.emailSender.SendEmail(ctx, event.Email, subject, body)
}
