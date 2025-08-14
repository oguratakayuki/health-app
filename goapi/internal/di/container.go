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
	UserController *controller.UserController
	IngredientController *controller.IngredientController
}

// NewContainer はContainerの新しいインスタンスを作成し、全ての依存関係を解決します。
func NewContainer() *Container {
	db, err := infrastructure.NewDBConnection()
	if err != nil {
		log.Fatalf("failed to establish database connection: %v", err)
	}

	// Gormリポジトリを注入
	userRepo := repository.NewGormUserRepository(db)
	userInteractor := usecase.NewUserInteractor(userRepo)
	userController := controller.NewUserController(userInteractor)

	ingredientRepo := repository.NewGormIngredientRepository(db)
	ingredientInteractor := usecase.NewIngredientInteractor(ingredientRepo)
	ingredientController := controller.NewIngredientController(ingredientInteractor)

	return &Container{
		UserController: userController,
		IngredientController: ingredientController,
	}
}
