package controller_test

import (
	"encoding/json"
	"goapi/internal/domain"
	"goapi/internal/infrastructure/controller"
	"goapi/internal/usecase"
	"net/http"
	"net/http/httptest"
	"testing"
	"errors"
)

// MockUserUseCase は usecase.UserUseCase インターフェースのモック実装です。
// テスト中にユースケースの代わりに動作します。
type MockUserUseCase struct {
	User *domain.User
	Err  error
}

// GetUserByID は、MockUserUseCaseがusecase.UserUseCaseインターフェースを満たすように実装したメソッドです。
// このメソッドは、MockUserUseCaseのUserとErrフィールドの値をそのまま返します。
func (m *MockUserUseCase) GetUserByID(id string) (*domain.User, error) {
	return m.User, m.Err
}

func TestGetUserByIDHandler_Success(t *testing.T) {
	mockInteractor := &MockUserUseCase{
		User: nil,
		Err:  usecase.ErrUserNotFound,
	}
	userController := controller.NewUserController(mockInteractor)

	// 実行: 有効なIDのリクエストをシミュレート
	req := httptest.NewRequest(http.MethodGet, "/users?id=999", nil)
	rec := httptest.NewRecorder()
	userController.GetUserByIDHandler(rec, req)

	// 検証: ステータスコードとエラーメッセージを確認
	if rec.Code != http.StatusNotFound {
		t.Errorf("Expected status code %d, but got %d", http.StatusNotFound, rec.Code)
	}

	var resBody map[string]string
	json.NewDecoder(rec.Body).Decode(&resBody)
	if resBody["error"] != "User not found" {
		t.Errorf("Unexpected error message: %s", resBody["error"])
	}
}

func TestGetUserByIDHandler_InvalidIDFormat(t *testing.T) {
	// 準備: モックユースケースは呼ばれないため、nilでOK
	userController := controller.NewUserController(nil)

	// 実行: 無効なID形式のリクエストをシミュレート
	req := httptest.NewRequest(http.MethodGet, "/users?id=abc", nil)
	rec := httptest.NewRecorder()
	userController.GetUserByIDHandler(rec, req)

	// 検証: ステータスコードとエラーメッセージを確認
	if rec.Code != http.StatusBadRequest {
		t.Errorf("Expected status code %d, but got %d", http.StatusBadRequest, rec.Code)
	}

	var resBody map[string]string
	json.NewDecoder(rec.Body).Decode(&resBody)
	if resBody["error"] != "Invalid ID format: ID must be numeric !" {
		t.Errorf("Unexpected error message: %s", resBody["error"])
	}
}

func TestGetUserByIDHandler_IDIsRequired(t *testing.T) {
	// 準備: モックユースケースは呼ばれないため、nilでOK
	userController := controller.NewUserController(nil)

	// 実行: IDなしのリクエストをシミュレート
	req := httptest.NewRequest(http.MethodGet, "/users", nil)
	rec := httptest.NewRecorder()
	userController.GetUserByIDHandler(rec, req)

	// 検証: ステータスコードとエラーメッセージを確認
	if rec.Code != http.StatusBadRequest {
		t.Errorf("Expected status code %d, but got %d", http.StatusBadRequest, rec.Code)
	}

	var resBody map[string]string
	json.NewDecoder(rec.Body).Decode(&resBody)
	if resBody["error"] != "ID is required" {
		t.Errorf("Unexpected error message: %s", resBody["error"])
	}
}

func TestGetUserByIDHandler_UserNotFound(t *testing.T) {
	// 準備: ユーザーが見つからないケースのモックユースケースを作成
	mockInteractor := &MockUserUseCase{
		User: nil,
		Err:  usecase.ErrUserNotFound,
	}
	userController := controller.NewUserController(mockInteractor)

	// 実行: 有効なIDのリクエストをシミュレート
	req := httptest.NewRequest(http.MethodGet, "/users?id=999", nil)
	rec := httptest.NewRecorder()
	userController.GetUserByIDHandler(rec, req)

	// 検証: ステータスコードとエラーメッセージを確認
	if rec.Code != http.StatusNotFound {
		t.Errorf("Expected status code %d, but got %d", http.StatusNotFound, rec.Code)
	}

	var resBody map[string]string
	json.NewDecoder(rec.Body).Decode(&resBody)
	if resBody["error"] != "User not found" {
		t.Errorf("Unexpected error message: %s", resBody["error"])
	}
}

func TestGetUserByIDHandler_InternalServerError(t *testing.T) {
	// 準備: 内部エラーが発生するケースのモックユースケースを作成
	mockInteractor := &MockUserUseCase{
		User: nil,
		Err:  errors.New("internal repo error"),
	}
	userController := controller.NewUserController(mockInteractor)

	// 実行: リクエストをシミュレート
	req := httptest.NewRequest(http.MethodGet, "/users?id=123", nil)
	rec := httptest.NewRecorder()
	userController.GetUserByIDHandler(rec, req)

	// 検証: ステータスコードとエラーメッセージを確認
	if rec.Code != http.StatusInternalServerError {
		t.Errorf("Expected status code %d, but got %d", http.StatusInternalServerError, rec.Code)
	}

	var resBody map[string]string
	json.NewDecoder(rec.Body).Decode(&resBody)
	if resBody["error"] != "Internal server error" {
		t.Errorf("Unexpected error message: %s", resBody["error"])
	}
}
