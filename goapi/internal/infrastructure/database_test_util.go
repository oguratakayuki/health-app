package infrastructure

import (
	"os"
	"testing"

	"gorm.io/gorm"
)

var testDB *gorm.DB

func SetupTestDB(t *testing.T) *gorm.DB {
	// テスト環境を強制セット
	os.Setenv("APP_ENV", "test")

	if testDB == nil {
		var err error
		testDB, err = NewDBConnection()
		if err != nil {
			t.Fatalf("failed to connect to test db: %v", err)
		}

		// マイグレーション
		// if err := testDB.AutoMigrate(&domain.Ingredient{}); err != nil {
		// 	t.Fatalf("failed to migrate test db: %v", err)
		// }
	}

	// テーブルをクリア
	if err := testDB.Exec("TRUNCATE TABLE ingredients").Error; err != nil {
		t.Fatalf("failed to truncate table: %v", err)
	}

	return testDB
}

