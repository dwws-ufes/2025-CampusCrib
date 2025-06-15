package ports

import "context"

type EmailSenderPort interface {
	SendEmail(ctx context.Context, to, subject, body string) error
}
