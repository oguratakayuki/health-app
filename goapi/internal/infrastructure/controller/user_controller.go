package controller

import (
	"encoding/json"
	"errors"
	"goapi/internal/domain"
	"goapi/internal/infrastructure/presenter"
	"goapi/internal/usecase"
	"net/http"
	"regexp"
	"strconv"
	"log"
	"github.com/go-chi/chi/v5"
)

// UserController はユーザー関連のHTTPリクエストを処理します。
type UserController struct {
	// 依存関係を具体的な実装ではなく、インターフェースに
	UserInteractor usecase.UserUseCase
}

// NewUserController はUserControllerの新しいインスタンスを作成します。
func NewUserController(ui usecase.UserUseCase) *UserController {
	return &UserController{
		// インターフェース型の引数をそのまま構造体のフィールドに代入
		UserInteractor: ui,
	}
}

// GetUserByIDHandler は /users?id={id} エンドポイントのHTTPハンドラです。
func (uc *UserController) GetUserByIDHandler(w http.ResponseWriter, r *http.Request) {
	// 1. リクエストのパース
	id := r.URL.Query().Get("id")

	// 2. 入力バリデーション (HTTP層の責務)
	if id == "" {
		presenter.RenderErrorJSON(w, "ID is required", http.StatusBadRequest)
		return
	}

	match, _ := regexp.MatchString(`^\d+$`, id)
	if !match {
		presenter.RenderErrorJSON(w, "Invalid ID format: ID must be numeric !", http.StatusBadRequest)
		return
	}

	// 3. ビジネスロジックの呼び出し (ユースケース)
	user, err := uc.UserInteractor.GetUserByID(id)
	if err != nil {
    if errors.Is(err, usecase.ErrUserNotFound) { // 定義した変数と直接比較
        presenter.RenderErrorJSON(w, "User not found", http.StatusNotFound)
        return
    }
		// その他の内部サーバーエラー
		presenter.RenderErrorJSON(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// 4. レスポンスの整形と返却 (プレゼンター)
	if err := presenter.RenderUserJSON(w, user); err != nil {
		// レンダリングエラー
		presenter.RenderErrorJSON(w, "Failed to render response", http.StatusInternalServerError)
	}
}

// UpdateUserHandler は /users/{id} エンドポイントのPUTリクエストを処理します。
func (uc *UserController) UpdateUserHandler(w http.ResponseWriter, r *http.Request) {
	// chiからURLパスパラメータを取得
	id := chi.URLParam(r, "id")
	if id == "" {
		presenter.RenderErrorJSON(w, "ID is required", http.StatusBadRequest)
		return
	}
	
	// IDのバリデーション
	idInt, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		presenter.RenderErrorJSON(w, "Invalid ID format: ID must be numeric !", http.StatusBadRequest)
		return
	}

	// リクエストボディから更新データをパース
	var input domain.UserUpdateInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		presenter.RenderErrorJSON(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	input.ID = idInt

	log.Printf("AAAAA 2")
	log.Printf("Error from id: %v", idInt)


	// ユースケースを呼び出し
	updatedUser, err := uc.UserInteractor.UpdateUser(&input)
	if err != nil {
		if errors.Is(err, usecase.ErrUserNotFound) {
			presenter.RenderErrorJSON(w, "User not found", http.StatusNotFound)
			return
		}
		presenter.RenderErrorJSON(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// レスポンスを返却
	if err := presenter.RenderUserJSON(w, updatedUser); err != nil {
		presenter.RenderErrorJSON(w, "Failed to render response", http.StatusInternalServerError)
	}
}
