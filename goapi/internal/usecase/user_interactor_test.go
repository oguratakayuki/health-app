package usecase_test

import (
	"errors"
	"goapi/internal/domain"
	"goapi/internal/usecase"
	"testing"
)

// MockUserRepository はusecase.UserRepositoryインターフェースのモック実装です。
// このモックはデータベースの代わりにダミーデータを返します。
type MockUserRepository struct{}

func (m *MockUserRepository) FindByID(id string) (*domain.User, error) {
	if id == "123" {
		return &domain.User{ID: "123", Name: "John Doe"}, nil
	}
	if id == "error" {
		return nil, errors.New("database connection failed")
	}
	return nil, nil // ユーザーが見つからない場合
}

func TestGetUserByID_Success(t *testing.T) {
	// モックリポジトリをユースケースに注入
	mockRepo := &MockUserRepository{}
	interactor := usecase.NewUserInteractor(mockRepo)

	user, err := interactor.GetUserByID("123")

	if err != nil {
		t.Errorf("Expected no error, but got: %v", err)
	}
	if user == nil {
		t.Error("Expected a user, but got nil")
	}
	if user.ID != "123" {
		t.Errorf("Expected user ID '123', but got '%s'", user.ID)
	}
}

func TestGetUserByID_NotFound(t *testing.T) {
	mockRepo := &MockUserRepository{}
	interactor := usecase.NewUserInteractor(mockRepo)

	user, err := interactor.GetUserByID("999")

	if err == nil {
		t.Error("Expected an error, but got none")
	}
	if err != nil && err.Error() != "user not found" {
		t.Errorf("Expected 'user not found' error, but got '%v'", err)
	}
	if user != nil {
		t.Errorf("Expected no user, but got: %v", user)
	}
}

func TestGetUserByID_RepoError(t *testing.T) {
	mockRepo := &MockUserRepository{}
	interactor := usecase.NewUserInteractor(mockRepo)

	_, err := interactor.GetUserByID("error")

	if err == nil {
		t.Error("Expected an error, but got none")
	}
	expectedErrMsg := "failed to get user by ID from repository: database connection failed"
	if err.Error() != expectedErrMsg {
		t.Errorf("Expected error '%s', but got '%v'", expectedErrMsg, err)
	}
}
