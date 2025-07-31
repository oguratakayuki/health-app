package main

import (
	"fmt"
	"net/http"
	"regexp" // 正規表現を使用するために追加
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// URLからクエリパラメータ 'id' を取得
		id := r.URL.Query().Get("id")

		// IDが空の場合
		if id == "" {
			http.Error(w, "ID is required", http.StatusBadRequest) // 400 Bad Request
			return
		}

		// IDが数字のみで構成されているか正規表現でチェック
		// ^: 文字列の先頭、\d+: 1回以上の数字、$: 文字列の末尾
		match, _ := regexp.MatchString(`^\d+$`, id)
		if !match {
			http.Error(w, "Invalid ID format: ID must be numeric !", http.StatusBadRequest) // 400 Bad Request
			return
		}

		// IDが妥当な場合
		fmt.Fprintln(w, "OK")
	})

	fmt.Println("Listening on :8080")
	http.ListenAndServe(":8080", nil)
}
