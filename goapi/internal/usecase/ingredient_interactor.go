package usecase

import (
	"goapi/internal/domain"
	"errors"
)

// ユーザーデータへのアクセスを抽象化
type IngredientRepository interface {
	FindByID(id int64) (*domain.Ingredient, error)
	Update(ingredient *domain.Ingredient) (*domain.Ingredient, error)
	FindAll() ([]*domain.Ingredient, error)
	Create(ingredient *domain.Ingredient) (*domain.Ingredient, error)
	Delete(id int64) error
	FindAllWithParams(filters map[string]interface{}, sortField string, sortOrder string, start int, end int) ([]*domain.Ingredient, int64, error)
}

// ユーザー関連のビジネスロジックを定義
type IngredientUseCase interface {
	GetIngredientByID(id int64) (*domain.Ingredient, error)
	UpdateIngredient(id int64, ingredient *domain.Ingredient) (*domain.Ingredient, error)
	ListIngredients() ([]*domain.Ingredient, error)
	CreateIngredient(ingredient *domain.Ingredient) (*domain.Ingredient, error)
	DeleteIngredient(id int64) error
	ListIngredientsWithParams(filters map[string]interface{}, sortField string, sortOrder string, start int, end int) ([]*domain.Ingredient, int64, error)
}

var ErrIngredientNotFound = errors.New("ingredient not found")

type IngredientInteractor struct {
	IngredientRepository IngredientRepository
}

func NewIngredientInteractor(r IngredientRepository) IngredientUseCase {
	return &IngredientInteractor{
		IngredientRepository: r,
	}
}

func (ui *IngredientInteractor) GetIngredientByID(id int64) (*domain.Ingredient, error) {
	ingredient, err := ui.IngredientRepository.FindByID(id)
	if err != nil {
		return nil, err
	}
	if ingredient == nil {
		return nil, ErrIngredientNotFound
	}
	return ingredient, nil
}

func (ui *IngredientInteractor) UpdateIngredient(id int64, ingredient *domain.Ingredient) (*domain.Ingredient, error) {
	updatedIngredient, err := ui.IngredientRepository.Update(ingredient)
	if err != nil {
		return nil, err
	}
	return updatedIngredient, nil
}

func (ui *IngredientInteractor) ListIngredients() ([]*domain.Ingredient, error) {
	return ui.IngredientRepository.FindAll()
}

func (ui *IngredientInteractor) CreateIngredient(ingredient *domain.Ingredient) (*domain.Ingredient, error) {
	return ui.IngredientRepository.Create(ingredient)
}

func (ui *IngredientInteractor) DeleteIngredient(id int64) error {
	return ui.IngredientRepository.Delete(id)
}
func (ui *IngredientInteractor) ListIngredientsWithParams(filters map[string]interface{}, sortField string, sortOrder string, start int, end int) ([]*domain.Ingredient, int64, error) {
	return ui.IngredientRepository.FindAllWithParams(filters, sortField, sortOrder, start, end)
}
