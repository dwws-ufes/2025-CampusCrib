package main

import (
	"context"
	"crib-search-service/api"
	"crib-search-service/infra/cache"
	"crib-search-service/infra/db"
	"crib-search-service/infra/elasticsearch"
	"crib-search-service/infra/kafka"
	"crib-search-service/infra/repository"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/joho/godotenv"
)

func getCacheTTL() time.Duration {
	ttlStr := os.Getenv("REDIS_CACHE_TTL_SECONDS")
	ttl, err := strconv.Atoi(ttlStr)
	if err != nil {
		return time.Minute * 5
	}
	return time.Second * time.Duration(ttl)
}

func main() {
	if os.Getenv("ENV") != "production" {
		if err := godotenv.Load(); err != nil {
			log.Println("⚠️ Couldnot load .env local.")
		}
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// DB Connection
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

	// Elasticsearch
	esClient := elasticsearch.NewElasticsearchClient()
	esIndexer := elasticsearch.NewCribIndexer(esClient)

	// Redis
	redisHost := os.Getenv("REDIS_HOST")
	redisPort := os.Getenv("REDIS_PORT")
	redisPassword := os.Getenv("REDIS_PASSWORD")
	redisAddr := fmt.Sprintf("%s:%s", redisHost, redisPort)
	redisDB := 0

	cache := cache.NewRedisCache(redisAddr, redisPassword, redisDB, getCacheTTL())

	// Repositories
	mongoRepo := repository.NewMongoCribRepository(dbInstance, "cribs")
	cribRepo := repository.NewCribRepositoryImpl(mongoRepo, esIndexer, cache)

	// KAFKA
	broker := os.Getenv("KAFKA_BROKER")
	groupID := os.Getenv("KAFKA_GROUP_ID")

	registeredTopic := os.Getenv("KAFKA_TOPIC_REGISTERED")
	updatedTopic := os.Getenv("KAFKA_TOPIC_UPDATED")
	deletedTopic := os.Getenv("KAFKA_TOPIC_DELETED")

	brokers := []string{broker}
	registeredConsumer := kafka.NewCribConsumer(brokers, registeredTopic, groupID, cribRepo)
	updatedConsumer := kafka.NewCribConsumer(brokers, updatedTopic, groupID, cribRepo)
	deletedConsumer := kafka.NewCribConsumer(brokers, deletedTopic, groupID, cribRepo)

	go func() {
		if err := registeredConsumer.StartConsuming(ctx); err != nil {
			log.Printf("registeredConsumer error: %v", err)
		}
	}()
	go func() {
		if err := updatedConsumer.StartConsuming(ctx); err != nil {
			log.Printf("updatedConsumer error: %v", err)
		}
	}()
	go func() {
		if err := deletedConsumer.StartConsuming(ctx); err != nil {
			log.Printf("deletedConsumer error: %v", err)
		}
	}()

	cribSearchController := api.NewCribSerachController(cribRepo)
	http.Handle("/api/search/cribs", cribSearchController)
	port := os.Getenv("CRIB_SEARCH_SERVER_PORT")
	if port == "" {
		port = "8085"
	}
	log.Printf("Server running on http://localhost:%s", port)
	go func() {
		if err := http.ListenAndServe(":"+port, nil); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	sig := make(chan os.Signal, 1)
	signal.Notify(sig, os.Interrupt, syscall.SIGTERM)
	<-sig
	log.Println("Finishing CribSearch Service.")

	_ = registeredConsumer.Close()
	_ = updatedConsumer.Close()
	_ = deletedConsumer.Close()

	log.Println("Consumers sucessfuly finished.")
}
