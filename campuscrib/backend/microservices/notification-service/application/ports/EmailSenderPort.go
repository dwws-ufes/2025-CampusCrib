package ports

type EmailSenderPort interface {
	SendEmail(to, subject, body string) error
}
