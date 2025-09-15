package repository

import (
	"goapi/internal/domain"
	"goapi/internal/usecase"

	"gorm.io/gorm"
)

type NutrientRepositoryImpl struct {
	DB *gorm.DB
}

func NewNutrientRepositoryImpl(db *gorm.DB) usecase.NutrientRepository {
	return &NutrientRepositoryImpl{DB: db}
}

func (r *NutrientRepositoryImpl) FindByID(id int64) (*domain.Nutrient, error) {
	var nutrient domain.Nutrient
	if err := r.DB.First(&nutrient, id).Error; err != nil {
		return nil, err
	}
	return &nutrient, nil
}

func (r *NutrientRepositoryImpl) Update(nutrient *domain.Nutrient) (*domain.Nutrient, error) {
	if err := r.DB.Save(nutrient).Error; err != nil {
		return nil, err
	}
	return nutrient, nil
}

func (r *NutrientRepositoryImpl) FindAll() ([]*domain.Nutrient, error) {
	var nutrients []*domain.Nutrient
	if err := r.DB.Find(&nutrients).Error; err != nil {
		return nil, err
	}
	return nutrients, nil
}

func (r *NutrientRepositoryImpl) Create(nutrient *domain.Nutrient) (*domain.Nutrient, error) {
	if err := r.DB.Create(nutrient).Error; err != nil {
		return nil, err
	}
	return nutrient, nil
}

func (r *NutrientRepositoryImpl) Delete(id int64) error {
	if err := r.DB.Delete(&domain.Nutrient{}, id).Error; err != nil {
		return err
	}
	return nil
}

func (r *NutrientRepositoryImpl) FindAllWithParams(filters map[string]interface{}, sortField string, sortOrder string, start int, end int) ([]*domain.Nutrient, int64, error) {
	var nutrients []*domain.Nutrient
	var total int64

	query := r.DB.Model(&domain.Nutrient{})

	for k, v := range filters {
		query = query.Where(k+" = ?", v)
	}

	if sortField != "" {
		query = query.Order(sortField + " " + sortOrder)
	}

	query.Count(&total)

	if err := query.Offset(start).Limit(end - start).Find(&nutrients).Error; err != nil {
		return nil, 0, err
	}
	return nutrients, total, nil
}

