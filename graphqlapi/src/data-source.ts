import "reflect-metadata";
import { DataSource } from "typeorm";
import { Users } from "./entities/Users";
import { Category } from "./entities/Category";
import { IngredientNutrient } from "./entities/IngredientNutrient";
import { Ingredient } from "./entities/Ingredient";
import { Nutrient } from "./entities/Nutrient";
import { IngredientTag } from "./entities/IngredientTag";
import { Tag } from "./entities/Tag";

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
    Users,
    Category,
    IngredientNutrient,
    Ingredient,
    Nutrient,
    IngredientTag,
    Tag,
  ],
});

