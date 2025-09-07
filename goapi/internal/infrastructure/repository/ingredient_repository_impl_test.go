
package repository_test

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"goapi/internal/domain"
	"goapi/internal/infrastructure"
	"goapi/internal/infrastructure/repository"
)

func TestIngredientRepository_CreateAndFind(t *testing.T) {
	db := infrastructure.SetupTestDB(t)
	repo := repository.NewGormIngredientRepository(db)

	ingredient := &domain.Ingredient{Name: "Tomato"}
	created, err := repo.Create(ingredient)
	assert.NoError(t, err)
	assert.NotNil(t, created)

	found, err := repo.FindByID(created.ID)
	assert.NoError(t, err)
	assert.Equal(t, "Tomato", found.Name)
}

func TestIngredientRepository_Update(t *testing.T) {
	db := infrastructure.SetupTestDB(t)
	repo := repository.NewGormIngredientRepository(db)

	ingredient := &domain.Ingredient{Name: "Carrot"}
	created, _ := repo.Create(ingredient)

	created.Name = "UpdatedCarrot"
	updated, err := repo.Update(created)
	assert.NoError(t, err)
	assert.Equal(t, "UpdatedCarrot", updated.Name)

	found, _ := repo.FindByID(created.ID)
	assert.Equal(t, "UpdatedCarrot", found.Name)
}

func TestIngredientRepository_Delete(t *testing.T) {
	db := infrastructure.SetupTestDB(t)
	repo := repository.NewGormIngredientRepository(db)

	ingredient := &domain.Ingredient{Name: "Cucumber"}
	created, _ := repo.Create(ingredient)

	err := repo.Delete(created.ID)
	assert.NoError(t, err)

	found, _ := repo.FindByID(created.ID)
	assert.Nil(t, found)

	err = repo.Delete(99999) // 存在しないID
	assert.Error(t, err)
}

func TestIngredientRepository_FindAll(t *testing.T) {
	db := infrastructure.SetupTestDB(t)
	repo := repository.NewGormIngredientRepository(db)

	// 初期データ投入
	_, _ = repo.Create(&domain.Ingredient{Name: "Onion"})
	_, _ = repo.Create(&domain.Ingredient{Name: "Garlic"})

	all, err := repo.FindAll()
	assert.NoError(t, err)
	assert.GreaterOrEqual(t, len(all), 2)
}

func TestIngredientRepository_FindAllWithParams(t *testing.T) {
	db := infrastructure.SetupTestDB(t)
	repo := repository.NewGormIngredientRepository(db)

	// データ投入
	_, _ = repo.Create(&domain.Ingredient{Name: "Apple"})
	_, _ = repo.Create(&domain.Ingredient{Name: "Banana"})
	_, _ = repo.Create(&domain.Ingredient{Name: "Apricot"})

	// 名前に "Ap" を含むものを検索
	filters := map[string]interface{}{"name": "Ap"}
	results, total, err := repo.FindAllWithParams(filters, "name", "ASC", 0, 10)

	assert.NoError(t, err)
	assert.GreaterOrEqual(t, total, int64(2))
	assert.True(t, results[0].Name <= results[len(results)-1].Name) // ソートされているか確認
}
