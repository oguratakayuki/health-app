// src/resolvers/NutrientResolver.ts
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { AppDataSource, initializeDataSource } from "../data-source";
import { Nutrient } from "../entities/Nutrient";
import { NutrientEntity } from "../entities/NutrientEntity";

@Resolver()
export class NutrientResolver {
  @Query(() => [Nutrient])
  async nutrients(): Promise<Nutrient[]> {
    await initializeDataSource();
    const repo = AppDataSource.getRepository(NutrientEntity);
    const rows = await repo.find({ order: { id: "ASC" } });

    // 手動マッピング（単純なフィールド）
    return rows.map((r) => ({
      id: r.id as unknown as string,
      name: r.name,
      createdAt: r.createdAt as Date,
      updatedAt: r.updatedAt as Date,
      parentId: r.parentId as unknown as number,
    }));
  }

  @Query(() => Nutrient, { nullable: true })
  async nutrient(@Arg("id") id: number): Promise<Nutrient | null> {
    await initializeDataSource();
    const repo = AppDataSource.getRepository(NutrientEntity);
    const r = await repo.findOne({ where: { id } });
    if (!r) return null;
    return {
      id: r.id as unknown as string,
      name: r.name,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      parentId: r.parentId as unknown as number,
    };
  }

  @Mutation(() => Nutrient)
  async createNutrient(@Arg("name") name: string): Promise<Nutrient> {
    await initializeDataSource();
    const repo = AppDataSource.getRepository(NutrientEntity);
    const now = new Date();
    const ent = repo.create({
      name,
      createdAt: now,
      updatedAt: now,
      parentId: null,
    });
    const saved: NutrientEntity = await repo.save(ent);
    return {
      id: saved.id as unknown as string,
      name: saved.name,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
      parentId: saved.parentId as unknown as number,
    };
  }

  @Mutation(() => Nutrient)
  async updateNutrient(@Arg("id") id: number, @Arg("name") name: string): Promise<Nutrient> {
    await initializeDataSource();
    const repo = AppDataSource.getRepository(NutrientEntity);
    const ent = await repo.findOne({ where: { id } });
    if (!ent) throw new Error("Nutrient not found");
    ent.name = name;
    ent.updatedAt = new Date();
    const saved = await repo.save(ent);
    return {
      id: saved.id as unknown as number,
      name: saved.name,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
      parentId: saved.parentId as unknown as number,
    };
  }

  // 削除
  @Mutation(() => Boolean)
  async deleteNutrient(@Arg("id") id: number): Promise<boolean> {
    await initializeDataSource();
    const repo = AppDataSource.getRepository(NutrientEntity);
    const res = await repo.delete(id);
    return !!res.affected;
  }
}

