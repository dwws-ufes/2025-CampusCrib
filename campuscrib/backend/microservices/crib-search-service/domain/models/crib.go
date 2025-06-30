package model

import (
	"github.com/google/uuid"
)

type Crib struct {
	ID                         uuid.UUID `bson:"_id" json:"id"`
	Title                      string    `bson:"title" json:"title"`
	Description                string    `bson:"description" json:"description"`
	Gender                     Gender    `bson:"gender" json:"gender"`
	PetsPolicy                 bool      `bson:"pets_policy" json:"pets_policy"`
	LandlordID                 uuid.UUID `bson:"landlord_id" json:"landlord_id"`
	NumberOfRooms              int       `bson:"number_of_rooms" json:"number_of_rooms"`
	NumberOfBathrooms          int       `bson:"number_of_bathrooms" json:"number_of_bathrooms"`
	NumberOfPeopleAlreadyIn    int       `bson:"number_of_people_already_in" json:"number_of_people_already_in"`
	NumberOfAvailableVacancies int       `bson:"number_of_available_vacancies" json:"number_of_available_vacancies"`
	Price                      float64   `bson:"price" json:"price"`
	Location                   Location  `bson:"location" json:"location"`
	Images                     []string  `bson:"images" json:"images"`
}
