import { DishService } from "../DishService";
import { IDishRepository } from "../../../domain/interfaces/IDishRepository";
import {
  Dish,
  DishWithIngredients,
  CreateDishInput,
  UpdateDishInput,
} from "../../../domain/entities/Dish";

// 完全なモックリポジトリの作成
const mockDishRepository: jest.Mocked<IDishRepository> = {
  findById: jest.fn(),
  findAll: jest.fn(),
  findAllWithIngredients: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByName: jest.fn(),
  count: jest.fn(),
  findWithIngredients: jest.fn(),
};

describe("DishService", () => {
  let dishService: DishService;

  beforeEach(() => {
    jest.clearAllMocks();
    dishService = new DishService(mockDishRepository);
  });

  describe("getDish", () => {
    it("should return a dish when found", async () => {
      const mockDish: DishWithIngredients = {
        id: "1",
        name: "Test Dish",
        createdAt: new Date(),
        updatedAt: new Date(),
        dishIngredients: [],
      };
      mockDishRepository.findById.mockResolvedValue(mockDish);

      const result = await dishService.getDish("1");

      expect(result).toEqual(mockDish);
      expect(mockDishRepository.findById).toHaveBeenCalledWith("1");
    });

    it("should return null when dish not found", async () => {
      // 準備
      mockDishRepository.findById.mockResolvedValue(null);

      // 実行
      const result = await dishService.getDish("999");

      // 検証
      expect(result).toBeNull();
      expect(mockDishRepository.findById).toHaveBeenCalledWith("999");
    });

    it("should throw error when repository fails", async () => {
      // 準備
      const error = new Error("Database error");
      mockDishRepository.findById.mockRejectedValue(error);

      // 実行 & 検証
      await expect(dishService.getDish("1")).rejects.toThrow(
        "Failed to get dish: Database error",
      );
    });
  });

  describe("createDish", () => {
    it("should create a dish successfully", async () => {
      // 準備
      const createInput: CreateDishInput = { name: "New Dish" };
      const createdDish: Dish = {
        id: "2",
        name: "New Dish",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockDishRepository.create.mockResolvedValue(createdDish);

      // 実行
      const result = await dishService.createDish(createInput);

      // 検証
      expect(result).toEqual(createdDish);
      expect(mockDishRepository.create).toHaveBeenCalledWith(createInput);
    });

    it("should throw error when name is empty", async () => {
      // 準備
      const createInput: CreateDishInput = { name: "" };

      // 実行 & 検証
      await expect(dishService.createDish(createInput)).rejects.toThrow(
        "Dish name is required",
      );
      expect(mockDishRepository.create).not.toHaveBeenCalled();
    });

    it("should throw error when name is only whitespace", async () => {
      // 準備
      const createInput: CreateDishInput = { name: "   " };

      // 実行 & 検証
      await expect(dishService.createDish(createInput)).rejects.toThrow(
        "Dish name is required",
      );
    });
  });

  describe("updateDish", () => {
    const existingDish: DishWithIngredients = {
      id: "1",
      name: "Old Dish",
      createdAt: new Date(),
      updatedAt: new Date(),
      dishIngredients: [],
    };

    it("should update dish successfully", async () => {
      // 準備
      const updateInput: UpdateDishInput = { name: "Updated Dish" };
      const updatedDish: Dish = {
        id: "1",
        name: "Updated Dish",
        createdAt: existingDish.createdAt,
        updatedAt: new Date(),
      };

      mockDishRepository.findById.mockResolvedValue(existingDish);
      mockDishRepository.update.mockResolvedValue(updatedDish);

      // 実行
      const result = await dishService.updateDish("1", updateInput);

      // 検証
      expect(result).toEqual(updatedDish);
      expect(mockDishRepository.findById).toHaveBeenCalledWith("1");
      expect(mockDishRepository.update).toHaveBeenCalledWith("1", updateInput);
    });

    it("should throw error when dish not found", async () => {
      // 準備
      mockDishRepository.findById.mockResolvedValue(null);
      const updateInput: UpdateDishInput = { name: "Updated Dish" };

      // 実行 & 検証
      await expect(dishService.updateDish("999", updateInput)).rejects.toThrow(
        "Dish with id 999 not found",
      );
      expect(mockDishRepository.update).not.toHaveBeenCalled();
    });

    it("should throw error when new name is empty", async () => {
      // 準備
      mockDishRepository.findById.mockResolvedValue(existingDish);
      const updateInput: UpdateDishInput = { name: "" };

      // 実行 & 検証
      await expect(dishService.updateDish("1", updateInput)).rejects.toThrow(
        "Dish name cannot be empty",
      );
      expect(mockDishRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteDish", () => {
    it("should delete dish successfully", async () => {
      // 準備
      const existingDish: DishWithIngredients = {
        id: "1",
        name: "Dish to delete",
        createdAt: new Date(),
        updatedAt: new Date(),
        dishIngredients: [],
      };
      mockDishRepository.findById.mockResolvedValue(existingDish);
      mockDishRepository.delete.mockResolvedValue(true);

      // 実行
      const result = await dishService.deleteDish("1");

      // 検証
      expect(result).toBe(true);
      expect(mockDishRepository.findById).toHaveBeenCalledWith("1");
      expect(mockDishRepository.delete).toHaveBeenCalledWith("1");
    });

    it("should throw error when dish not found", async () => {
      // 準備
      mockDishRepository.findById.mockResolvedValue(null);

      // 実行 & 検証
      await expect(dishService.deleteDish("999")).rejects.toThrow(
        "Dish with id 999 not found",
      );
      expect(mockDishRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe("searchDishesByName", () => {
    it("should search dishes by name", async () => {
      // 準備
      const mockDishes: Dish[] = [
        {
          id: "1",
          name: "Chicken Curry",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          name: "Chicken Salad",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockDishRepository.findByName.mockResolvedValue(mockDishes);

      // 実行
      const result = await dishService.searchDishesByName("Chicken");

      // 検証
      expect(result).toEqual(mockDishes);
      expect(mockDishRepository.findByName).toHaveBeenCalledWith("Chicken");
    });

    it("should return all dishes when search term is empty", async () => {
      // 準備
      const mockDishes: Dish[] = [
        {
          id: "1",
          name: "Dish 1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          name: "Dish 2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockDishRepository.findAll.mockResolvedValue(mockDishes);

      // 実行
      const result = await dishService.searchDishesByName("");

      // 検証
      expect(result).toEqual(mockDishes);
      expect(mockDishRepository.findAll).toHaveBeenCalled();
      expect(mockDishRepository.findByName).not.toHaveBeenCalled();
    });
  });
});
