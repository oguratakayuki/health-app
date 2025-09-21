import "reflect-metadata";
import { DataSource } from "typeorm";
import { Categories } from "./entities/Categories";
import { IngredientNutrients } from "./entities/IngredientNutrients";
import { Ingredients } from "./entities/Ingredients";
import { Nutrients } from "./entities/Nutrients";
import { Users } from "./entities/Users";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "db",
  port: 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "rootp",
  database: process.env.DB_NAME || "health_development",
  synchronize: false, // 本番はfalse、開発で試すならtrueでもOK
  logging: true,
  entities: [Categories, IngredientNutrients, Ingredients, Nutrients, Users],
});

