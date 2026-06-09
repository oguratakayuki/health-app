# バックエンドにおけるデータマッピング・腐敗防止層（ACL）の設計規律

本ドキュメントは、バックエンド（Backend）における各レイヤー間のデータ移動、およびデータ構造の変換（マッピング）に関するアーキテクチャの規律を定義します。

この規律を遵守することで、Webフレームワーク（GraphQL）やORM（Prisma）といった「外部の具体的な技術」の変更から、システムのコアであるビジネスロジック（Application/Domain層）を完全に保護します。

---

## 1. システム全体のレイヤー構造とマッパーの位置づけ

データマッピングは、レイヤー間の境界線として機能する `src/backend/acl/`（Anti-Corruption Layer: 腐敗防止層）に集約します。

マッパーは「上り（入力）」と「下り（出力）」の双方向の変換をカプセル化する番人です。

```text
【Presentation層】 (GraphQL Input / Type)
       │
       ▼ 🌟 acl/presentation_application/ (Presentation ⇄ Application の翻訳)
       │
【Application層】  (UseCase DTO)
       │
       ▼ 🔄 Service内部での直接詰め替え (Domain共通型への移行)
       │
【Domain層】       (Domain Entity / Repository Input)
       │
       ▼ 🌟 acl/domain_infrastructure/   (Domain ⇄ Infrastructure の翻訳)
       │
【Infrastructure層】(Prisma Client / DB生データ)
```

---

## 2. ACL（腐敗防止層）ディレクトリ規律

### 📁 acl/presentation_application/xxx.ts

**責務:** Presentation（Resolver）⇄ Application の双方向マッピング

#### ①【上り】ResolverからApplicationクラスへデータを渡す際のマッピング

- 型変換の実行場所: `presentation/resolver` クラス
- 型変換の方法: ACLマッパーのメソッド（例: `toUseCaseDto`）を呼び出す
- 変換元の型: `presentation/graphql/inputs/xxx`（画面からの生の入力型）
- 変換先の型: `application/dtos/xxx`（ユースケース専用のDTO型）

#### ②【下り】Applicationから受け取ったものをResolverで返す際のマッピング

- 型変換の実行場所: `presentation/resolver` クラス（Serviceからデータを受け取った直後）
- 型変換の方法: ACLマッパーのメソッド（例: `toGraphQLType`）を呼び出す
- 変換元の型: `domain/entities/xxx`（純粋なドメインエンティティ）
- 変換先の型: `presentation/graphql/types/xxx`（GraphQLの出力型）

---

### 📁 acl/domain_infrastructure/xxx.ts

**責務:** Domain ⇄ Infrastructure（Repository）のマッピング

#### ①【上り】Application（Service）からRepositoryへデータを渡す際の流れ

- 型変換の実行場所: `application/service` クラスの内部
- 型変換の方法: Serviceクラス内で直接変換（詰め替え）を行う

**設計意図**

ここは「Application層 ➔ Domain層」へのデータ移行であり、インフラ特有の技術（Prisma等）が絡まない純粋なドメイン型同士のやり取りです。

そのため、インフラ用の腐敗防止層（ACL）を通す必要はありません。

**依存性の逆転原理（DIP）**

Domain層にRepositoryのinterfaceを記述し、Infrastructure層のRepository実装クラスがそれに従います。

結果的に、Repositoryが要求する引数（Input型）はDomain層の持ち物となります。

- 変換元の型: `application/dtos/xxx`
- 変換先の型: `domain/entities/xxxRepositoryUpdateInput` など

#### ②【下り】Infra/RepositoryからServiceクラスへデータを返す際のマッピング

- 型変換の実行場所: `infrastructure/repositories/xxxRepository`（実装クラス）の内部
- 型変換の方法: ACLマッパーのメソッド（例: `toDomain`）を呼び出す
- 変換元の型: Prisma Clientの自動生成型（データベースの生データ構造）
- 変換先の型: `domain/entities/xxx`（純粋なドメインエンティティ構造）

**設計意図**

Repositoryの `update` や `create` などのミューテーション系メソッドであっても、`findById`（参照系）と完全に同じ「最新状態のドメインエンティティ構造」を返すことで、Service層での不要な再クエリを防ぎます。

---

## 3. 型定義（Types / Entities）の配置規律

「型」はそのデータを直接消費するレイヤー（故郷）に配置し、`acl/` には純粋な変換ロジック（マッパー）のみを設置します。

また、インフラ技術固有の名称（Prismaなど）をDomain層やPresentation層のパスに混入させてはいけません。

### 🔹 Presentation層 (`src/backend/presentation/graphql/`)

画面や外部クライアントとの契約を表す型。

```text
inputs/dish/CreateDishInput.ts
※ inputs/prisma/ のような技術名フォルダは禁止

types/nutrient/DailyNutrientTotal.ts
```

### 🔹 Application層 (`src/backend/application/dtos/`)

特定のユースケース（機能・画面の目的）を達成するために定義された専用の型。

```text
UpdateMealUseCaseDto.ts
```

### 🔹 Domain層 (`src/backend/domain/`)

システム全体で普遍的なビジネスルールを表す型。

```text
types/
 └ NutrientCode.ts

entities/
 ├ Ingredient.ts
 ├ Meal.ts
 └ MealRepositoryUpdateInput.ts
```

---

## 4. コード実装サンプル（食事更新のライフサイクル）

### Resolver（Presentation層）

```typescript
@Mutation(() => GraphQLMealType, { name: "updateMeal" })
@Authorized()
async updateMeal(
  @Arg("id") id: string,
  @Arg("input") input: UpdateMealInput,
  @Ctx() ctx: GraphQLContext,
): Promise<GraphQLMealType> {
  // 1. 【上りACL】画面の入力をUseCase DTOに翻訳
  const dto: UpdateMealUseCaseDto =
    MealPresentationMapper.toUseCaseDto(input);

  try {
    const mealService = this.getMealService(ctx);

    // 2. サービス実行（サービスはピュアなドメインエンティティを返す）
    const domainMeal = await mealService.updateMeal(id, dto);

    // 3. 【下りACL】ドメインエンティティをGraphQLの出力型に翻訳して返却
    return MealPresentationMapper.toGraphQLType(domainMeal);
  } catch (error) {
    throw new Error(`Failed to update meal: ${error}`);
  }
}
```

### Service（Application層）

```typescript
async updateMeal(
  id: string,
  dto: UpdateMealUseCaseDto,
): Promise<Meal> {
  // 1. 【ドメイン間の直接詰め替え】
  const repositoryInput: MealRepositoryUpdateInput = {
    category: dto.category,
    startTime: dto.startTime,
    endTime: dto.endTime,
  };

  // 2. リポジトリの呼び出し
  return await this.mealRepository.update(
    parseInt(id),
    repositoryInput,
  );
}
```

### Repository（Infrastructure層）

```typescript
async update(
  id: number,
  data: MealRepositoryUpdateInput,
): Promise<DomainMeal> {
  // 1. Prismaクライアントの実行
  const prismaMeal = await this.prisma.meal.update({
    where: { id },
    data: data,
  });

  // 2. 【下りACL】Prismaの生オブジェクトをドメインエンティティへ変換
  return MealRepositoryMapper.toDomain(prismaMeal);
}
```
