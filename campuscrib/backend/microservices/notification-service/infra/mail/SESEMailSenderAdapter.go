package mail

import (
	"context"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/ses"
	"github.com/aws/aws-sdk-go-v2/service/ses/types"
)

type SesEmailSenderAdapter struct {
	Client      *ses.Client
	SourceEmail string
}

func NewSesEmailSenderAdapter(region, source string) (*SesEmailSenderAdapter, error) {
	cfg, err := config.LoadDefaultConfig(context.Background(), config.WithRegion(region))
	if err != nil {
		return nil, fmt.Errorf("Falha ao carregar config AWS: %w", err)
	}

	return &SesEmailSenderAdapter{
		Client:      ses.NewFromConfig(cfg),
		SourceEmail: source,
	}, nil
}

func (s *SesEmailSenderAdapter) SendEmail(ctx context.Context, to, subject, body string) error {
	input := &ses.SendEmailInput{
		Source: aws.String(s.SourceEmail),
		Destination: &types.Destination{
			ToAddresses: []string{to},
		},
		Message: &types.Message{
			Subject: &types.Content{Data: aws.String(subject)},
			Body: &types.Body{
				Html: &types.Content{Data: aws.String(body)},
			},
		},
	}

	_, err := s.Client.SendEmail(ctx, input)
	if err != nil {
		return fmt.Errorf("SES SendEmail falhou: %w", err)
	}

	return nil
}
