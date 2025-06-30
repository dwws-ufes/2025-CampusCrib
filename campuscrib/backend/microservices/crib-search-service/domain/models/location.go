package models

type Location struct {
	Latitude  float64 `bson:"latitude" json:"latitude"`
	Longitude float64 `bson:"longitude" json:"longitude"`
	Address   string  `bson:"address" json:"address"`
	City      string  `bson:"city" json:"city"`
	State     string  `bson:"state" json:"state"`
	ZipCode   string  `bson:"zip_code" json:"zip_code"`
}
