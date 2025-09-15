// internal/infrastructure/controller/ingredient_nutrient_controller.go
package controller

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"goapi/internal/domain"
	"goapi/internal/usecase"

	"github.com/gin-gonic/gin"
)

type IngredientNutrientController struct {
	IngredientNutrientInteractor usecase.IngredientNutrientUseCase
}

func NewIngredientNutrientController(interactor usecase.IngredientNutrientUseCase) *IngredientNutrientController {
	return &IngredientNutrientController{
		IngredientNutrientInteractor: interactor,
	}
}

// 単体取得
func (uc *IngredientNutrientController) GetIngredientNutrient(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	inr, err := uc.IngredientNutrientInteractor.GetIngredientNutrientByID(id)
	if err != nil {
		if errors.Is(err, usecase.ErrIngredientNutrientNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "IngredientNutrient not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, inr)
}

// 作成
func (uc *IngredientNutrientController) CreateIngredientNutrient(c *gin.Context) {
	var input domain.IngredientNutrient
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}
	created, err := uc.IngredientNutrientInteractor.CreateIngredientNutrient(&input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusCreated, created)
}

// 更新
func (uc *IngredientNutrientController) UpdateIngredientNutrient(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var input domain.IngredientNutrient
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	updated, err := uc.IngredientNutrientInteractor.UpdateIngredientNutrient(id, &input)
	if err != nil {
		if errors.Is(err, usecase.ErrIngredientNutrientNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "IngredientNutrient not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, updated)
}

// 削除
func (uc *IngredientNutrientController) DeleteIngredientNutrient(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	err = uc.IngredientNutrientInteractor.DeleteIngredientNutrient(id)
	if err != nil {
		if errors.Is(err, usecase.ErrIngredientNutrientNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "IngredientNutrient not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"deleted": id})
}

// 一覧取得
func (uc *IngredientNutrientController) ListIngredientNutrients(c *gin.Context) {
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

	list, total, err := uc.IngredientNutrientInteractor.ListIngredientNutrientsWithParams(filters, sortField, sortOrder, start, end)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	c.Header("Access-Control-Expose-Headers", "Content-Range")
	c.Header("Content-Range", fmt.Sprintf("ingredient_nutrients %d-%d/%d", start, end, total))
	c.JSON(http.StatusOK, list)
}

