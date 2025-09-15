// internal/infrastructure/controller/nutrient_controller.go
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

type NutrientController struct {
	NutrientInteractor usecase.NutrientUseCase
}

func NewNutrientController(interactor usecase.NutrientUseCase) *NutrientController {
	return &NutrientController{
		NutrientInteractor: interactor,
	}
}

// 単体取得
func (uc *NutrientController) GetNutrient(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	nutrient, err := uc.NutrientInteractor.GetNutrientByID(id)
	if err != nil {
		if errors.Is(err, usecase.ErrNutrientNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Nutrient not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, nutrient)
}

// 作成
func (uc *NutrientController) CreateNutrient(c *gin.Context) {
	var input domain.Nutrient
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}
	created, err := uc.NutrientInteractor.CreateNutrient(&input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusCreated, created)
}

// 更新
func (uc *NutrientController) UpdateNutrient(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var input domain.Nutrient
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	updated, err := uc.NutrientInteractor.UpdateNutrient(id, &input)
	if err != nil {
		if errors.Is(err, usecase.ErrNutrientNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Nutrient not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, updated)
}

// 削除
func (uc *NutrientController) DeleteNutrient(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	err = uc.NutrientInteractor.DeleteNutrient(id)
	if err != nil {
		if errors.Is(err, usecase.ErrNutrientNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Nutrient not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"deleted": id})
}

// 一覧取得
func (uc *NutrientController) ListNutrients(c *gin.Context) {
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

	nutrients, total, err := uc.NutrientInteractor.ListNutrientsWithParams(filters, sortField, sortOrder, start, end)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	c.Header("Access-Control-Expose-Headers", "Content-Range")
	c.Header("Content-Range", fmt.Sprintf("nutrients %d-%d/%d", start, end, total))
	c.JSON(http.StatusOK, nutrients)
}

