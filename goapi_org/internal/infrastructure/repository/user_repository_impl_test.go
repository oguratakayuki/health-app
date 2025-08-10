package repository_test

import (
	"errors"
	"goapi/internal/infrastructure/repository"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
)

// TestFindByID_Success は、指定されたIDのユーザーが正常に取得できるケースをテストします。
func TestFindByID_Success(t *testing.T) {
	// データベース接続とモックをセットアップ
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	// 期待するSQLクエリと、その結果として返したい行をモックに設定
	rows := sqlmock.NewRows([]string{"id", "email"}).AddRow(1, "test@example.com")
	mock.ExpectQuery("SELECT id, email FROM users WHERE id = ?").WithArgs(1).WillReturnRows(rows)

	// モックDBを使ってリポジトリを作成
	repo := repository.NewMySQLUserRepository(db)

	// FindByIDメソッドをテスト
	user, err := repo.FindByID("1")
	if err != nil {
		t.Errorf("expected no error, but got '%v'", err)
	}
	if user == nil {
		t.Fatal("expected user to be returned, but got nil")
	}
	if user.ID != 1 || user.Email != "test@example.com" {
		t.Errorf("unexpected user returned: %+v", user)
	}

	// モックに設定した期待値がすべて満たされたか確認
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

// TestFindByID_NotFound は、指定されたIDのユーザーが見つからないケースをテストします。
func TestFindByID_NotFound(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	// 期待するSQLクエリを設定。今回は行を返さない（ユーザーが見つからない状況をシミュレート）
	mock.ExpectQuery("SELECT id, email FROM users WHERE id = ?").WithArgs(2).WillReturnRows(sqlmock.NewRows([]string{"id", "email"}))

	repo := repository.NewMySQLUserRepository(db)

	user, err := repo.FindByID("2")
	if err != nil {
		t.Errorf("expected no error for not found user, but got '%v'", err)
	}
	if user != nil {
		t.Errorf("expected user to be nil, but got %+v", user)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

// TestFindByID_QueryError は、データベースクエリでエラーが発生するケースをテストします。
func TestFindByID_QueryError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	// 期待するSQLクエリにエラーを返すよう設定
	mock.ExpectQuery("SELECT id, email FROM users WHERE id = ?").WithArgs(3).WillReturnError(errors.New("database connection failed"))

	repo := repository.NewMySQLUserRepository(db)

	_, err = repo.FindByID("3")
	if err == nil {
		t.Error("expected an error, but got none")
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

