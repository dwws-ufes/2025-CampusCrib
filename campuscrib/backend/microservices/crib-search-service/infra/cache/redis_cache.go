package cache

import (
	"context"
	"crib-search-service/domain/models"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisCache struct {
	client     *redis.Client
	expiration time.Duration
}

func NewRedisCache(addr, password string, db int, expiration time.Duration) *RedisCache {
	rdb := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
		DB:       db,
	})

	return &RedisCache{
		client:     rdb,
		expiration: expiration,
	}
}

func (r *RedisCache) GetCrib(ctx context.Context, id string) (*models.Crib, error) {
	val, err := r.client.Get(ctx, fmt.Sprintf("crib:%s", id)).Result()
	if err == redis.Nil {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	var crib models.Crib
	if err := json.Unmarshal([]byte(val), &crib); err != nil {
		return nil, err
	}
	return &crib, nil
}

func (r *RedisCache) SetCrib(ctx context.Context, crib *models.Crib) error {
	data, err := json.Marshal(crib)
	if err != nil {
		return err
	}
	key := fmt.Sprintf("crib:%s", crib.ID.String())
	return r.client.Set(ctx, key, data, r.expiration).Err()
}

func (r *RedisCache) DeleteCrib(ctx context.Context, id string) error {
	return r.client.Del(ctx, fmt.Sprintf("crib:%s", id)).Err()
}
