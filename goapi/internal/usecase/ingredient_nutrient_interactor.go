package usecase

import (
	"errors"
	"goapi/internal/domain"
)

type IngredientNutrientRepository interface {
	FindByID(id int64) (*domain.IngredientNutrient, error)
	Update(in *domain.IngredientNutrient) (*domain.IngredientNutrient, error)
	FindAll() ([]*domain.IngredientNutrient, error)
	Create(in *domain.IngredientNutrient) (*domain.IngredientNutrient, error)
	Delete(id int64) error
	FindAllWithParams(filters map[string]interface{}, sortField string, sortOrder string, start int, end int) ([]*domain.IngredientNutrient, int64, error)
}

type IngredientNutrientUseCase interface {
	GetIngredientNutrientByID(id int64) (*domain.IngredientNutrient, error)
	UpdateIngredientNutrient(id int64, in *domain.IngredientNutrient) (*domain.IngredientNutrient, error)
	ListIngredientNutrients() ([]*domain.IngredientNutrient, error)
	CreateIngredientNutrient(in *domain.IngredientNutrient) (*domain.IngredientNutrient, error)
	DeleteIngredientNutrient(id int64) error
	ListIngredientNutrientsWithParams(filters map[string]interface{}, sortField string, sortOrder string, start int, end int) ([]*domain.IngredientNutrient, int64, error)
}

var ErrIngredientNutrientNotFound = errors.New("ingredient_nutrient not found")

type IngredientNutrientInteractor struct {
	IngredientNutrientRepository IngredientNutrientRepository
}

func NewIngredientNutrientInteractor(r IngredientNutrientRepository) IngredientNutrientUseCase {
	return &IngredientNutrientInteractor{
		IngredientNutrientRepository: r,
	}
}

func (ui *IngredientNutrientInteractor) GetIngredientNutrientByID(id int64) (*domain.IngredientNutrient, error) {
	in, err := ui.IngredientNutrientRepository.FindByID(id)
	if err != nil {
		return nil, err
	}
	if in == nil {
		return nil, ErrIngredientNutrientNotFound
	}
	return in, nil
}

func (ui *IngredientNutrientInteractor) UpdateIngredientNutrient(id int64, in *domain.IngredientNutrient) (*domain.IngredientNutrient, error) {
	updated, err := ui.IngredientNutrientRepository.Update(in)
	if err != nil {
		return nil, err
	}
	return updated, nil
}

func (ui *IngredientNutrientInteractor) ListIngredientNutrients() ([]*domain.IngredientNutrient, error) {
	return ui.IngredientNutrientRepository.FindAll()
}

func (ui *IngredientNutrientInteractor) CreateIngredientNutrient(in *domain.IngredientNutrient) (*domain.IngredientNutrient, error) {
	return ui.IngredientNutrientRepository.Create(in)
}

func (ui *IngredientNutrientInteractor) DeleteIngredientNutrient(id int64) error {
	return ui.IngredientNutrientRepository.Delete(id)
}

func (ui *IngredientNutrientInteractor) ListIngredientNutrientsWithParams(filters map[string]interface{}, sortField string, sortOrder string, start int, end int) ([]*domain.IngredientNutrient, int64, error) {
	return ui.IngredientNutrientRepository.FindAllWithParams(filters, sortField, sortOrder, start, end)
}

