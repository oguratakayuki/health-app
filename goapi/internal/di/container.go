// internal/di/container.go

package di

import (
	"goapi/internal/infrastructure/controller"
	"goapi/internal/infrastructure/repository"
	"goapi/internal/usecase"
)

// Container はアプリケーションの依存関係を保持・提供します。
type Container struct {
	UserController *controller.UserController
}

// NewContainer はContainerの新しいインスタンスを作成し、全ての依存関係を解決します。
func NewContainer() *Container {
	userRepo := repository.NewInMemoryUserRepository()
	userInteractor := usecase.NewUserInteractor(userRepo) // ここは変更なし

	// NewUserControllerの引数にインターフェースを渡す
	userController := controller.NewUserController(userInteractor)

	return &Container{
		UserController: userController,
	}
}
