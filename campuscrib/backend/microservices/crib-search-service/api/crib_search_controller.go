package api

import (
	"context"
	"crib-search-service/domain/models"
	"crib-search-service/domain/repository"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/google/uuid"
)

type CribSerachController struct {
	repository repository.CribRepository
}

func NewCribSerachController(repo repository.CribRepository) *CribSerachController {
	return &CribSerachController{repository: repo}
}

func (c *CribSerachController) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	filters := make(map[string]interface{})
	query := r.URL.Query()
	fmt.Println("query")
	fmt.Println(query)

	id := query.Get("id")
	if id != "" {
		idStringfy, err := uuid.Parse(id)
		if err != nil {
			http.Error(w, "Crib not found", http.StatusNotFound)
			return
		}
		crib, err := c.repository.FindById(r.Context(), idStringfy)
		if err != nil {
			http.Error(w, "Crib not found", http.StatusNotFound)
			return
		}
		json.NewEncoder(w).Encode(crib)
		return
	}

	if gender := query.Get("gender"); gender != "" {
		filters["gender"] = gender
	}
	if pets := query.Get("petsPolicy"); pets != "" {
		filters["petsPolicy"] = pets == "true"
	}
	if rooms := query.Get("numberOfRooms"); rooms != "" {
		if val, err := strconv.Atoi(rooms); err == nil {
			filters["numberOfRooms"] = val
		}
	}
	if baths := query.Get("numberOfBathrooms"); baths != "" {
		if val, err := strconv.Atoi(baths); err == nil {
			filters["numberOfBathrooms"] = val
		}
	}
	if vacancies := query.Get("availableVacancies"); vacancies != "" {
		if val, err := strconv.Atoi(vacancies); err == nil {
			filters["numberOfAvailableVacancies"] = val
		}
	}
	if price := query.Get("price"); price != "" {
		if val, err := strconv.ParseFloat(price, 64); err == nil {
			filters["price"] = val
		}
	}
	if landlordId := query.Get("landlordId"); landlordId != "" {
		filters["landlordId"] = landlordId
	}
	if city := query.Get("city"); city != "" {
		filters["location.city"] = city
	}
	if state := query.Get("state"); state != "" {
		filters["location.state"] = state
	}
	if neighborhood := query.Get("neighborhood"); neighborhood != "" {
		filters["location.neighborhood"] = neighborhood
	}

	numericRangeFilter := func(param string) (min, max *float64) {
		if val := query.Get(param + "Min"); val != "" {
			if f, err := strconv.ParseFloat(val, 64); err == nil {
				min = &f
			}
		}
		if val := query.Get(param + "Max"); val != "" {
			if f, err := strconv.ParseFloat(val, 64); err == nil {
				max = &f
			}
		}
		return
	}

	if min, max := numericRangeFilter("numberOfRooms"); min != nil || max != nil {
		filters["numberOfRoomsRange"] = map[string]*float64{"min": min, "max": max}
	}
	if min, max := numericRangeFilter("numberOfBathrooms"); min != nil || max != nil {
		filters["numberOfBathroomsRange"] = map[string]*float64{"min": min, "max": max}
	}
	if min, max := numericRangeFilter("availableVacancies"); min != nil || max != nil {
		filters["numberOfAvailableVacanciesRange"] = map[string]*float64{"min": min, "max": max}
	}
	if min, max := numericRangeFilter("price"); min != nil || max != nil {
		filters["priceRange"] = map[string]*float64{"min": min, "max": max}
	}

	cribs, err := c.repository.FindAll(context.Background(), filters)
	if err != nil {
		log.Println("Erro searching cribs:", err)
		http.Error(w, "Erro searching cribs", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if cribs == nil {
		cribs = []models.Crib{}
	}
	json.NewEncoder(w).Encode(cribs)
}
