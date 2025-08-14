package repository
import (
	"errors"
	"goapi/internal/domain"
	"goapi/internal/usecase"
	"gorm.io/gorm"
	"fmt"
	"strings"
)
// usecase.IngredientRepositoryインターフェースの実装
type GormIngredientRepository struct {
	db *gorm.DB
}
func NewGormIngredientRepository(db *gorm.DB) usecase.IngredientRepository {
	return &GormIngredientRepository{
		db: db,
	}
}
func (r *GormIngredientRepository) FindByID(id int64) (*domain.Ingredient, error) {
	var ingredient domain.Ingredient
	result := r.db.First(&ingredient, id)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil // ユーザーが見つからない場合は nil, nil を返す
		}
		return nil, result.Error
	}
	return &ingredient, nil
}
func (r *GormIngredientRepository) Update(ingredient *domain.Ingredient) (*domain.Ingredient, error) {
	result := r.db.Save(ingredient)
	if result.Error != nil {
		return nil, result.Error
	}
	return ingredient, nil
}
func (r *GormIngredientRepository) Create(ingredient *domain.Ingredient) (*domain.Ingredient, error) {
	result := r.db.Create(ingredient)
	if result.Error != nil {
		return nil, result.Error
	}
	return ingredient, nil
}
func (r *GormIngredientRepository) Delete(id int64) error {
	result := r.db.Delete(&domain.Ingredient{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("ingredient not found")
	}
	return nil
}
func (r *GormIngredientRepository) FindAll() ([]*domain.Ingredient, error) {
	var ingredients []*domain.Ingredient
	result := r.db.Find(&ingredients)
	if result.Error != nil {
		return nil, result.Error
	}
	return ingredients, nil
}

func (r *GormIngredientRepository) FindAllWithParams(filters map[string]interface{}, sortField string, sortOrder string, start int, end int) ([]*domain.Ingredient, int64, error) {
	var ingredients []*domain.Ingredient
	var total int64
	query := r.db.Model(&domain.Ingredient{})
	// フィルタ適用
	for key, value := range filters {
		if v, ok := value.(string); ok && v != "" {
			query = query.Where(fmt.Sprintf("%s LIKE ?", key), "%"+v+"%")
		} else {
			query = query.Where(fmt.Sprintf("%s = ?", key), value)
		}
	}
	// 総件数取得
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	// ソート適用
	if sortField != "" {
		order := sortField
		if strings.ToUpper(sortOrder) == "DESC" {
			order += " desc"
		}
		query = query.Order(order)
	}
	// ページング適用
	limit := end - start + 1
	if limit < 0 {
		limit = 0
	}
	query = query.Offset(start).Limit(limit)
	// データ取得
	if err := query.Find(&ingredients).Error; err != nil {
		return nil, 0, err
	}
	return ingredients, total, nil
}
