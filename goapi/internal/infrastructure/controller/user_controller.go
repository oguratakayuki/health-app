package controller

import (
	"errors"
	"net/http"
	"strconv"
	"goapi/internal/domain"
	"goapi/internal/usecase"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type UserController struct {
	UserInteractor usecase.UserUseCase
}

func NewUserController(ui usecase.UserUseCase) *UserController {
	return &UserController{
		UserInteractor: ui,
	}
}

// GetUserByID はIDを指定してユーザーを取得します。
func (uc *UserController) GetUserByID(c *gin.Context) {
	idStr := c.Query("id")
	if idStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
		return
	}
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

// UpdateUser はユーザー情報を更新します。
func (uc *UserController) UpdateUser(c *gin.Context) {
	idStr := c.Param("id")
	if idStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
		return
	}
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var input domain.UserUpdateInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	user := &domain.User{
		Model: gorm.Model{
			ID: uint(id),
		}, 
		Email: input.Email,
	}
	updatedUser, err := uc.UserInteractor.UpdateUser(user)
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
