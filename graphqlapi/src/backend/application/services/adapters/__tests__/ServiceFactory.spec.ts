import { describe, it, expect, vi } from "vitest";
import { ServiceFactory } from "../index";
import { MealService } from "../../MealService";
import { createCognitoService } from "../PrismaAdapter";

vi.mock("../PrismaAdapter", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../PrismaAdapter")>();
  return {
    ...actual,
    createCognitoService: vi.fn(),
  };
});

describe("ServiceFactory", () => {
  it("should provide MealService via getServicesFromContext when not provided in context", () => {
    const context = {};
    const services = ServiceFactory.getServicesFromContext(context);
    
    expect(services.mealService).toBeInstanceOf(MealService);
  });

  it("should return the MealService instance from context if provided", () => {
    const mockMealService = { findById: vi.fn() } as unknown as MealService;
    const context = { mealService: mockMealService };
    const services = ServiceFactory.getServicesFromContext(context);
    
    expect(services.mealService).toBe(mockMealService);
  });
});
