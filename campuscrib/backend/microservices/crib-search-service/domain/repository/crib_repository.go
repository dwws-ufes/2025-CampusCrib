package repository

import (
	"context"

	"crib-search-service/domain/models"

	"github.com/google/uuid"
)

type CribRepository interface {
	Save(ctx context.Context, crib *models.Crib) error
	Update(ctx context.Context, crib *models.Crib) error
	Delete(ctx context.Context, id uuid.UUID) error
	FindById(ctx context.Context, id uuid.UUID) (*models.Crib, error)
	FindAll(ctx context.Context, filters map[string]interface{}) ([]models.Crib, error)
}
