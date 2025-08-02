// internal/infrastructure/repository/user_repository_impl.go
package repository

import (
	"database/sql"
	"fmt"
	"goapi/internal/domain"
	"goapi/internal/usecase"

	_ "github.com/go-sql-driver/mysql" // MySQLドライバをインポート
)

// MySQLUserRepository はusecase.UserRepositoryインターフェースのMySQL実装です。
type MySQLUserRepository struct {
	db *sql.DB
}

// NewMySQLUserRepository はMySQLUserRepositoryの新しいインスタンスを作成します。
func NewMySQLUserRepository(db *sql.DB) usecase.UserRepository {
	return &MySQLUserRepository{
		db: db,
	}
}

// FindByID は指定されたIDのユーザーをデータベースから取得します。
func (r *MySQLUserRepository) FindByID(id string) (*domain.User, error) {
	query := "SELECT id, email FROM users WHERE id = ?"

	// idは文字列で渡されるが、SQLクエリに渡す前にint64に変換
	var userID int64
	if _, err := fmt.Sscanf(id, "%d", &userID); err != nil {
		return nil, fmt.Errorf("invalid ID format: %w", err)
	}

	row := r.db.QueryRow(query, userID)

	var user domain.User
	if err := row.Scan(&user.ID, &user.Email); err != nil {
		if err == sql.ErrNoRows {
			// ユーザーが見つからない場合は nil, nil を返す
			return nil, nil
		}
		// その他のデータベースエラー
		return nil, fmt.Errorf("failed to scan user: %w", err)
	}

	return &user, nil
}

