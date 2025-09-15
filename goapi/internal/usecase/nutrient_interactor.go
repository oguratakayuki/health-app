package usecase

import (
	"errors"
	"goapi/internal/domain"
)

type NutrientRepository interface {
	FindByID(id int64) (*domain.Nutrient, error)
	Update(nutrient *domain.Nutrient) (*domain.Nutrient, error)
	FindAll() ([]*domain.Nutrient, error)
	Create(nutrient *domain.Nutrient) (*domain.Nutrient, error)
	Delete(id int64) error
	FindAllWithParams(filters map[string]interface{}, sortField string, sortOrder string, start int, end int) ([]*domain.Nutrient, int64, error)
}

type NutrientUseCase interface {
	GetNutrientByID(id int64) (*domain.Nutrient, error)
	UpdateNutrient(id int64, nutrient *domain.Nutrient) (*domain.Nutrient, error)
	ListNutrients() ([]*domain.Nutrient, error)
	CreateNutrient(nutrient *domain.Nutrient) (*domain.Nutrient, error)
	DeleteNutrient(id int64) error
	ListNutrientsWithParams(filters map[string]interface{}, sortField string, sortOrder string, start int, end int) ([]*domain.Nutrient, int64, error)
}

var ErrNutrientNotFound = errors.New("nutrient not found")

type NutrientInteractor struct {
	NutrientRepository NutrientRepository
}

func NewNutrientInteractor(r NutrientRepository) NutrientUseCase {
	return &NutrientInteractor{
		NutrientRepository: r,
	}
}

func (ui *NutrientInteractor) GetNutrientByID(id int64) (*domain.Nutrient, error) {
	nutrient, err := ui.NutrientRepository.FindByID(id)
	if err != nil {
		return nil, err
	}
	if nutrient == nil {
		return nil, ErrNutrientNotFound
	}
	return nutrient, nil
}

func (ui *NutrientInteractor) UpdateNutrient(id int64, nutrient *domain.Nutrient) (*domain.Nutrient, error) {
	updated, err := ui.NutrientRepository.Update(nutrient)
	if err != nil {
		return nil, err
	}
	return updated, nil
}

func (ui *NutrientInteractor) ListNutrients() ([]*domain.Nutrient, error) {
	return ui.NutrientRepository.FindAll()
}

func (ui *NutrientInteractor) CreateNutrient(nutrient *domain.Nutrient) (*domain.Nutrient, error) {
	return ui.NutrientRepository.Create(nutrient)
}

func (ui *NutrientInteractor) DeleteNutrient(id int64) error {
	return ui.NutrientRepository.Delete(id)
}

func (ui *NutrientInteractor) ListNutrientsWithParams(filters map[string]interface{}, sortField string, sortOrder string, start int, end int) ([]*domain.Nutrient, int64, error) {
	return ui.NutrientRepository.FindAllWithParams(filters, sortField, sortOrder, start, end)
}

