package repository

import (
	"context"
	"crib-search-service/domain/models"
	"crib-search-service/infra/cache"
	"crib-search-service/infra/elasticsearch"

	"github.com/google/uuid"
)

type CribRepositoryImpl struct {
	mongoRepository *MongoCribRepository
	indexer         *elasticsearch.CribIndexer
	cache           *cache.RedisCache
}

func NewCribRepositoryImpl(mongoRepo *MongoCribRepository, cribIndexer *elasticsearch.CribIndexer, cache *cache.RedisCache) *CribRepositoryImpl {
	return &CribRepositoryImpl{
		mongoRepository: mongoRepo,
		indexer:         cribIndexer,
		cache:           cache,
	}
}

func (r *CribRepositoryImpl) Save(ctx context.Context, crib *models.Crib) error {
	if err := r.mongoRepository.Save(ctx, crib); err != nil {
		return err
	}
	return r.indexer.Index(ctx, crib)
}

func (r *CribRepositoryImpl) Update(ctx context.Context, crib *models.Crib) error {
	if err := r.mongoRepository.Update(ctx, crib); err != nil {
		return err
	}
	if err := r.cache.DeleteCrib(ctx, crib.ID.String()); err != nil {
		return err
	}
	return r.indexer.Index(ctx, crib)
}

func (r *CribRepositoryImpl) Delete(ctx context.Context, id uuid.UUID) error {
	if err := r.mongoRepository.Delete(ctx, id); err != nil {
		return err
	}
	if err := r.cache.DeleteCrib(ctx, id.String()); err != nil {
		return err
	}
	return r.indexer.Delete(ctx, id.String())
}

func (r *CribRepositoryImpl) FindById(ctx context.Context, id uuid.UUID) (*models.Crib, error) {
	// var crib *models.Crib
	// crib, err := r.mongoRepository.FindById(ctx, id)

	// if err != nil {
	// 	return nil, err
	// }

	// return crib, nil
	crib, err := r.cache.GetCrib(ctx, id.String())
	if err != nil {
		return nil, err
	}
	if crib != nil {
		return crib, nil
	}

	crib, err = r.mongoRepository.FindById(ctx, id)
	if err != nil {
		return nil, err
	}
	if crib != nil {
		_ = r.cache.SetCrib(ctx, crib)
	}
	return crib, nil
}

func (r *CribRepositoryImpl) FindAll(ctx context.Context, filters map[string]interface{}) ([]models.Crib, error) {
	return r.indexer.Search(ctx, filters)
}
