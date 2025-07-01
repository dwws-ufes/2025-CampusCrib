package repository

import (
	"context"
	"crib-search-service/domain/models"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type MongoCribRepository struct {
	collection *mongo.Collection
}

func NewMongoCribRepository(db *mongo.Database, collectionName string) *MongoCribRepository {
	return &MongoCribRepository{
		collection: db.Collection(collectionName),
	}
}

func (r *MongoCribRepository) Save(ctx context.Context, crib *models.Crib) error {
	_, err := r.collection.InsertOne(ctx, crib)
	return err
}

func (r *MongoCribRepository) Update(ctx context.Context, crib *models.Crib) error {
	filter := bson.M{"cribId": crib.ID}
	update := bson.M{"$set": crib}

	_, err := r.collection.UpdateOne(ctx, filter, update)
	return err
}

func (r *MongoCribRepository) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.collection.DeleteOne(ctx, bson.M{"cribId": id})
	return err
}

func (r *MongoCribRepository) FindById(ctx context.Context, id uuid.UUID) (*models.Crib, error) {
	var crib models.Crib
	err := r.collection.FindOne(ctx, bson.M{"cribId": id}).Decode(&crib)

	if err != nil {
		return nil, err
	}

	return &crib, nil
}

func (r *MongoCribRepository) FindAll(ctx context.Context, filters map[string]interface{}) ([]models.Crib, error) {
	cursor, err := r.collection.Find(ctx, filters)

	if err != nil {
		return nil, err
	}

	defer cursor.Close(ctx)

	var cribs []models.Crib
	for cursor.Next(ctx) {
		var crib models.Crib
		if err := cursor.Decode(&crib); err != nil {
			return nil, err
		}
		cribs = append(cribs, crib)
	}

	return cribs, nil
}
