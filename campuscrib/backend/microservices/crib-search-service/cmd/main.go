package main

import (
	"crib-search-service/infra/db"
	mongorepo "crib-search-service/infra/repository"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/joho/godotenv"
)

func main() {
	if os.Getenv("ENV") != "production" {
		if err := godotenv.Load(); err != nil {
			log.Println("⚠️ Couldnot load .env local.")
		}
	}

	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017"
	}

	client := db.NewMongoClient(mongoURI)

	dbName := os.Getenv("MONGODB_DATABASE")
	if dbName == "" {
		dbName = "cribsearch_db"
	}

	dbInstance := client.Database(dbName)
	cribRepo := mongorepo.NewMongoCribRepository(dbInstance, "cribs")

	// TODO: use o cribRepo no seu serviço (com os consumers, handler http etc)
	_ = cribRepo

	sig := make(chan os.Signal, 1)
	signal.Notify(sig, os.Interrupt, syscall.SIGTERM)
	<-sig
	log.Println("Finishing CribSearch Service.")
}
