import { runInTransaction, prisma } from '../../../../../test-transaction';
import { PrismaIngredientRepository } from '../IngredientRepository';

describe('IngredientRepository', () => {

  describe('#create', () => {
    it('新しい食材を作成できること', async () => {
      await runInTransaction(async (tx) => {
        const repository = new PrismaIngredientRepository(tx);

        const input = {
          name: 'Tomato',
          remarks: 'Fresh red tomato',
          originalName: 'トマト',
        };

        const ingredient = await repository.create(input);

        expect(ingredient.id).toBeDefined();
        expect(ingredient.name).toBe('Tomato');
        expect(ingredient.remarks).toBe('Fresh red tomato');
        expect(ingredient.originalName).toBe('トマト');
        expect(ingredient.createdAt).toBeInstanceOf(Date);
        expect(ingredient.updatedAt).toBeInstanceOf(Date);
      });
    });
  });

  describe('#findById', () => {
    it('作成した食材をIDで取得できること', async () => {
      await runInTransaction(async (tx) => {
        const repository = new PrismaIngredientRepository(tx);

        const created = await repository.create({
          name: 'Carrot',
        });

        const found = await repository.findById(created.id);
        expect(found).not.toBeNull();
        expect(found?.name).toBe('Carrot');
      });
    });

    it('存在しないIDはnullを返すこと', async () => {
      await runInTransaction(async (tx) => {
        const repository = new PrismaIngredientRepository(tx);

        const found = await repository.findById(999999);
        expect(found).toBeNull();
      });
    });
  });

  describe('#findAll', () => {
    it('複数の食材を取得できること', async () => {
      await runInTransaction(async (tx) => {
        const repository = new PrismaIngredientRepository(tx);

        await repository.create({ name: 'Potato' });
        await repository.create({ name: 'Onion' });

        const list = await repository.findAll();
        expect(list.length).toBe(2);
        const names = list.map(i => i.name).sort();
        expect(names).toEqual(['Onion', 'Potato']);
      });
    });
  });

  describe('#update', () => {
    it('食材を更新できること', async () => {
      await runInTransaction(async (tx) => {
        const repository = new PrismaIngredientRepository(tx);

        const created = await repository.create({
          name: 'Beef',
          remarks: 'Red meat',
        });

        const updated = await repository.update(created.id, {
          name: 'Updated Beef',
          remarks: 'Updated remarks',
        });

        expect(updated.name).toBe('Updated Beef');
        expect(updated.remarks).toBe('Updated remarks');
        expect(updated.updatedAt.getTime()).toBeGreaterThan(created.updatedAt.getTime());
      });
    });
  });
});

