package di

import (
	"log"

	"goapi/internal/infrastructure"
	"goapi/internal/infrastructure/controller"
	"goapi/internal/infrastructure/repository"
	"goapi/internal/usecase"
)

// Container はアプリケーションの依存関係を保持・提供します。
type Container struct {
	UserController              *controller.UserController
	IngredientController        *controller.IngredientController
	NutrientController          *controller.NutrientController
	IngredientNutrientController *controller.IngredientNutrientController
}

// NewContainer はContainerの新しいインスタンスを作成し、全ての依存関係を解決します。
func NewContainer() *Container {
	db, err := infrastructure.NewDBConnection()
	if err != nil {
		log.Fatalf("failed to establish database connection: %v", err)
	}

	// User
	userRepo := repository.NewGormUserRepository(db)
	userInteractor := usecase.NewUserInteractor(userRepo)
	userController := controller.NewUserController(userInteractor)

	// Ingredient
	ingredientRepo := repository.NewGormIngredientRepository(db)
	ingredientInteractor := usecase.NewIngredientInteractor(ingredientRepo)
	ingredientController := controller.NewIngredientController(ingredientInteractor)

	// Nutrient
	nutrientRepo := repository.NewNutrientRepositoryImpl(db)
	nutrientInteractor := usecase.NewNutrientInteractor(nutrientRepo)
	nutrientController := controller.NewNutrientController(nutrientInteractor)

	// IngredientNutrient
	ingredientNutrientRepo := repository.NewIngredientNutrientRepositoryImpl(db)
	ingredientNutrientInteractor := usecase.NewIngredientNutrientInteractor(ingredientNutrientRepo)
	ingredientNutrientController := controller.NewIngredientNutrientController(ingredientNutrientInteractor)

	return &Container{
		UserController:               userController,
		IngredientController:         ingredientController,
		NutrientController:           nutrientController,
		IngredientNutrientController: ingredientNutrientController,
	}
}
