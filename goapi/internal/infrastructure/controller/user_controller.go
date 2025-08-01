// internal/infrastructure/controller/user_controller.go
package controller

import (
	"net/http"
	"regexp"
	"goapi/internal/infrastructure/presenter"
	"goapi/internal/usecase" // ユースケースを呼び出すため
)

// UserController はユーザー関連のHTTPリクエストを処理します。
type UserController struct {
	UserInteractor *usecase.UserInteractor
}

// NewUserController はUserControllerの新しいインスタンスを作成します。
func NewUserController(ui *usecase.UserInteractor) *UserController {
	return &UserController{
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
		// エラーハンドリング
		if err.Error() == "user not found" { // ユースケースで定義した特定のエラー
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
