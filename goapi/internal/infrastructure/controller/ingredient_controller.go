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

type IngredientController struct {
       IngredientInteractor usecase.IngredientUseCase
}

func NewIngredientController(interactor usecase.IngredientUseCase) *IngredientController {
	return &IngredientController{
		IngredientInteractor: interactor,
	}
}

// 単体取得（idパスパラ版）
func (uc *IngredientController) GetIngredient(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	ingredient, err := uc.IngredientInteractor.GetIngredientByID(id)
	if err != nil {
		if errors.Is(err, usecase.ErrIngredientNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Ingredient not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, ingredient)
}

// 作成
func (uc *IngredientController) CreateIngredient(c *gin.Context) {
	var input domain.Ingredient
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}
	createdIngredient, err := uc.IngredientInteractor.CreateIngredient(&input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusCreated, createdIngredient)
}

// 削除
func (uc *IngredientController) DeleteIngredient(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	err = uc.IngredientInteractor.DeleteIngredient(id)
	if err != nil {
		if errors.Is(err, usecase.ErrIngredientNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Ingredient not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"deleted": id})
}
// 更新
func (uc *IngredientController) UpdateIngredient(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var input domain.Ingredient
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	updatedIngredient, err := uc.IngredientInteractor.UpdateIngredient(id, &input)
	if err != nil {
		if errors.Is(err, usecase.ErrIngredientNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Ingredient not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, updatedIngredient)
}

// 一覧取得
func (uc *IngredientController) ListIngredients(c *gin.Context) {
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

	ingredients, total, err := uc.IngredientInteractor.ListIngredientsWithParams(filters, sortField, sortOrder, start, end)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	// Content-Range ヘッダー
	c.Header("Access-Control-Expose-Headers", "Content-Range")
	c.Header("Content-Range", fmt.Sprintf("ingredients %d-%d/%d", start, end, total))

	c.JSON(http.StatusOK, ingredients)
}
