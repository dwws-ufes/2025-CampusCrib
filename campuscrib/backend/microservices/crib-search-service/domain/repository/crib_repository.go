package repository

import (
	"context"
)

type CribRepository interface {
	Save(ctx context.Context, crib *model.Crib) error
}
