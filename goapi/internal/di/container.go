// internal/di/container.go
package di

import (
	"database/sql"
	"fmt"
	"goapi/internal/infrastructure/controller"
	"goapi/internal/infrastructure/repository"
	"goapi/internal/usecase"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

// Container はアプリケーションの依存関係を保持・提供します。
type Container struct {
	UserController *controller.UserController
}

// NewContainer はContainerの新しいインスタンスを作成し、全ての依存関係を解決します。
func NewContainer() *Container {
	// データベース接続のセットアップ
	// Docker Composeのdbサービスに接続
	dbHost := "db"
	dbUser := "root"
	dbPassword := "rootp"
	dbName := "health_development"
	dbPort := "3306"

	// 接続文字列
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=true&loc=Local",
		dbUser, dbPassword, dbHost, dbPort, dbName)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	// 接続の確認
	if err := db.Ping(); err != nil {
		log.Fatalf("failed to ping database: %v", err)
	}
	log.Println("Successfully connected to MySQL database!")

	// リポジトリの実装を初期化 (MySQL接続を渡す)
	userRepo := repository.NewMySQLUserRepository(db)

	// ユースケースを初期化し、リポジトリを注入
	userInteractor := usecase.NewUserInteractor(userRepo)

	// コントローラーを初期化し、ユースケースを注入
	userController := controller.NewUserController(userInteractor)

	return &Container{
		UserController: userController,
	}
}
