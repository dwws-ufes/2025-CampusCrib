package elasticsearch

import (
	"log"
	"os"

	"github.com/elastic/go-elasticsearch/v8"
)

func NewElasticsearchClient() *elasticsearch.Client {
	cfg := elasticsearch.Config{
		Addresses: []string{
			os.Getenv("ELASTICSEARCH_URL"),
		},
	}

	es, err := elasticsearch.NewClient(cfg)
	if err != nil {
		log.Fatalf("Failed to create Elasticsearch client: %v", err)
	}

	return es
}
