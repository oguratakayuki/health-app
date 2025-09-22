import { Resolver, Query, Mutation, Arg, Int } from "type-graphql";
import { TagCategory } from "../entities/TagCategory";
import { Tag } from "../entities/Tag";
import { AppDataSource } from "../data-source";

@Resolver(() => TagCategory)
export class TagCategoryResolver {
  private tagCategoryRepository = AppDataSource.getRepository(TagCategory);

  @Query(() => [TagCategory])
  async tagCategories(): Promise<TagCategory[]> {
    return this.tagCategoryRepository.find({ relations: ["tags"] });
  }

  @Query(() => TagCategory, { nullable: true })
  async tagCategory(@Arg("id", () => Int) id: number): Promise<TagCategory | null> {
    return this.tagCategoryRepository.findOne({
      where: { id },
      relations: ["tags"],
    });
  }

  @Mutation(() => TagCategory)
  async createTagCategory(@Arg("name") name: string): Promise<TagCategory> {
    const newCategory = this.tagCategoryRepository.create({ name });
    return this.tagCategoryRepository.save(newCategory);
  }

  @Mutation(() => TagCategory)
  async updateTagCategory(
    @Arg("id", () => Int) id: number,
    @Arg("name") name: string
  ): Promise<TagCategory> {
    const category = await this.tagCategoryRepository.findOneByOrFail({ id });
    category.name = name;
    return this.tagCategoryRepository.save(category);
  }

  @Mutation(() => Boolean)
  async deleteTagCategory(@Arg("id", () => Int) id: number): Promise<boolean> {
    await this.tagCategoryRepository.delete(id);
    return true;
  }
}

