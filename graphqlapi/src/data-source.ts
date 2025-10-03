import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Category } from "./entities/Category";
import { IngredientNutrient } from "./entities/IngredientNutrient";
import { Ingredient } from "./entities/Ingredient";
import { Nutrient } from "./entities/Nutrient";
import { IngredientTag } from "./entities/IngredientTag";
import { Tag } from "./entities/Tag";
import { TagCategory } from "./entities/TagCategory";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "db",
  port: 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "rootp",
  database: process.env.DB_NAME || "health_development",
  synchronize: false,
  logging: true,
  entities: [
    User,
    Category,
    IngredientNutrient,
    Ingredient,
    Nutrient,
    IngredientTag,
    Tag,
    TagCategory,
  ],
});

// データソース初期化関数
export const initializeDataSource = async (): Promise<DataSource> => {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log("Data Source has been initialized!");
    } catch (error) {
      console.error("Error during Data Source initialization:", error);
      throw error;
    }
  }
  return AppDataSource;
};
