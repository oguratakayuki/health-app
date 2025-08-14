package controller

import (
			"errors"
			"net/http"
			"strconv"
			"goapi/internal/domain"
			"goapi/internal/usecase"
			"github.com/gin-gonic/gin"
			 "fmt"
			 "encoding/json"
)

type UserController struct {
       UserInteractor usecase.UserUseCase
}

func NewUserController(interactor usecase.UserUseCase) *UserController {
	return &UserController{
		UserInteractor: interactor,
	}
}

// 一覧取得
func (uc *UserController) ListUsers(c *gin.Context) {
	var filters map[string]interface{}
	_ = json.Unmarshal([]byte(c.Query("filter")), &filters)

	var r []int
	_ = json.Unmarshal([]byte(c.Query("range")), &r)
	start, end := 0, 9
	if len(r) == 2 {
		start, end = r[0], r[1]
	}

	var s []string
	_ = json.Unmarshal([]byte(c.Query("sort")), &s)
	sortField, sortOrder := "id", "ASC"
	if len(s) == 2 {
		sortField, sortOrder = s[0], s[1]
	}

	users, total, err := uc.UserInteractor.ListUsersWithParams(filters, sortField, sortOrder, start, end)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	// Content-Range ヘッダー
	c.Header("Access-Control-Expose-Headers", "Content-Range")
	c.Header("Content-Range", fmt.Sprintf("users %d-%d/%d", start, end, total))

	c.JSON(http.StatusOK, users)
}

// 単体取得（idパスパラ版）
func (uc *UserController) GetUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	user, err := uc.UserInteractor.GetUserByID(id)
	if err != nil {
		if errors.Is(err, usecase.ErrUserNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, user)
}

// 作成
func (uc *UserController) CreateUser(c *gin.Context) {
	var input domain.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}
	createdUser, err := uc.UserInteractor.CreateUser(&input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusCreated, createdUser)
}

// 削除
func (uc *UserController) DeleteUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	err = uc.UserInteractor.DeleteUser(id)
	if err != nil {
		if errors.Is(err, usecase.ErrUserNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"deleted": id})
}
// 更新
func (uc *UserController) UpdateUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var input domain.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	updatedUser, err := uc.UserInteractor.UpdateUser(id, &input)
	if err != nil {
		if errors.Is(err, usecase.ErrUserNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, updatedUser)
}
