package repository

import (
	"goapi/internal/domain"
	"goapi/internal/usecase"

	"gorm.io/gorm"
)

type IngredientNutrientRepositoryImpl struct {
	DB *gorm.DB
}

func NewIngredientNutrientRepositoryImpl(db *gorm.DB) usecase.IngredientNutrientRepository {
	return &IngredientNutrientRepositoryImpl{DB: db}
}

func (r *IngredientNutrientRepositoryImpl) FindByID(id int64) (*domain.IngredientNutrient, error) {
	var in domain.IngredientNutrient
	if err := r.DB.First(&in, id).Error; err != nil {
		return nil, err
	}
	return &in, nil
}

func (r *IngredientNutrientRepositoryImpl) Update(in *domain.IngredientNutrient) (*domain.IngredientNutrient, error) {
	if err := r.DB.Save(in).Error; err != nil {
		return nil, err
	}
	return in, nil
}

func (r *IngredientNutrientRepositoryImpl) FindAll() ([]*domain.IngredientNutrient, error) {
	var list []*domain.IngredientNutrient
	if err := r.DB.Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *IngredientNutrientRepositoryImpl) Create(in *domain.IngredientNutrient) (*domain.IngredientNutrient, error) {
	if err := r.DB.Create(in).Error; err != nil {
		return nil, err
	}
	return in, nil
}

func (r *IngredientNutrientRepositoryImpl) Delete(id int64) error {
	if err := r.DB.Delete(&domain.IngredientNutrient{}, id).Error; err != nil {
		return err
	}
	return nil
}

func (r *IngredientNutrientRepositoryImpl) FindAllWithParams(filters map[string]interface{}, sortField string, sortOrder string, start int, end int) ([]*domain.IngredientNutrient, int64, error) {
	var list []*domain.IngredientNutrient
	var total int64

	query := r.DB.Model(&domain.IngredientNutrient{})

	for k, v := range filters {
		query = query.Where(k+" = ?", v)
	}

	if sortField != "" {
		query = query.Order(sortField + " " + sortOrder)
	}

	query.Count(&total)

	if err := query.Offset(start).Limit(end - start).Find(&list).Error; err != nil {
		return nil, 0, err
	}
	return list, total, nil
}

