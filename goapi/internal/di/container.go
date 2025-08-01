// internal/di/container.go
package di

import (
	"goapi/internal/infrastructure/controller"
	"goapi/internal/infrastructure/repository"
	"goapi/internal/usecase"
)

// Container はアプリケーションの依存関係を保持・提供
type Container struct {
	UserController *controller.UserController
}

// NewContainer はContainerの新しいインスタンスを作成し、全ての依存関係を解決します。
func NewContainer() *Container {
	// リポジトリの実装を初期化 (DB接続など)
	userRepo := repository.NewInMemoryUserRepository()

	// ユースケースを初期化し、リポジトリを注入
	userInteractor := usecase.NewUserInteractor(userRepo)

	// コントローラーを初期化し、ユースケースを注入
	userController := controller.NewUserController(userInteractor)

	return &Container{
		UserController: userController,
	}
}
