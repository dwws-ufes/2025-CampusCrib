package elasticsearch

import (
	"bytes"
	"context"
	"crib-search-service/domain/models"
	"encoding/json"
	"fmt"

	es "github.com/elastic/go-elasticsearch/v8"
)

type CribIndexer struct {
	client *es.Client
	index  string
}

func NewCribIndexer(client *es.Client) *CribIndexer {
	return &CribIndexer{
		client: client,
		index:  "cribs",
	}
}

func (ci *CribIndexer) Index(ctx context.Context, crib *models.Crib) error {
	data, _ := json.Marshal(crib)
	res, err := ci.client.Index(
		ci.index,
		bytes.NewReader(data),
		ci.client.Index.WithDocumentID(crib.ID.String()),
		ci.client.Index.WithContext(ctx),
	)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	if res.IsError() {
		return fmt.Errorf("failed to index crib: %s", res.String())
	}

	fmt.Printf("Indexed crib: %s\n", crib.ID.String())
	return nil
}

func (ci *CribIndexer) Delete(ctx context.Context, cribId string) error {
	res, err := ci.client.Delete(ci.index, cribId, ci.client.Delete.WithContext(ctx))
	if err != nil {
		return err
	}
	defer res.Body.Close()

	if res.IsError() {
		return fmt.Errorf("failed to delete crib from index: %s", res.String())
	}
	return nil
}

func (ci *CribIndexer) Search(ctx context.Context, query map[string]interface{}) ([]models.Crib, error) {
	var cribs []models.Crib

	esQuery := map[string]interface{}{
		"query": map[string]interface{}{
			"bool": map[string]interface{}{
				"must":   []interface{}{},
				"filter": []interface{}{},
			},
		},
	}

	for key, value := range query {
		switch key {
		case "gender", "petsPolicy", "numberOfRooms", "numberOfBathrooms", "numberOfAvailableVacancies", "price", "landlordId", "location.city", "location.state", "location.neighborhood":
			esQuery["query"].(map[string]interface{})["bool"].(map[string]interface{})["filter"] = append(
				esQuery["query"].(map[string]interface{})["bool"].(map[string]interface{})["filter"].([]interface{}),
				map[string]interface{}{
					"term": map[string]interface{}{
						key: value,
					},
				},
			)
		case "numberOfRoomsRange", "numberOfBathroomsRange", "numberOfAvailableVacanciesRange", "priceRange":
			rangeQuery := map[string]interface{}{}
			rangeData := value.(map[string]*float64)
			if rangeData["min"] != nil {
				rangeQuery["gte"] = *rangeData["min"]
			}
			if rangeData["max"] != nil {
				rangeQuery["lte"] = *rangeData["max"]
			}
			esQuery["query"].(map[string]interface{})["bool"].(map[string]interface{})["filter"] = append(
				esQuery["query"].(map[string]interface{})["bool"].(map[string]interface{})["filter"].([]interface{}),
				map[string]interface{}{
					"range": map[string]interface{}{
						key[:len(key)-5]: rangeQuery,
					},
				},
			)
		}
	}

	searchBody, err := json.Marshal(esQuery)
	if err != nil {
		return nil, err
	}

	res, err := ci.client.Search(
		ci.client.Search.WithContext(ctx),
		ci.client.Search.WithIndex(ci.index),
		ci.client.Search.WithBody(bytes.NewReader(searchBody)),
	)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.IsError() {
		return nil, fmt.Errorf("search error: %s", res.String())
	}

	var r struct {
		Hits struct {
			Hits []struct {
				Source models.Crib `json:"_source"`
			} `json:"hits"`
		} `json:"hits"`
	}

	if err := json.NewDecoder(res.Body).Decode(&r); err != nil {
		return nil, err
	}

	for _, hit := range r.Hits.Hits {
		cribs = append(cribs, hit.Source)
	}

	return cribs, nil
}
