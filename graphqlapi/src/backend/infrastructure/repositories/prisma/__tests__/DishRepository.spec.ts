import { PrismaDishRepository } from '../DishRepository';
import { runInTransaction } from '../../../../../test-transaction';

describe('DishRepository', () => {

  describe('#create', () => {
    it('料理を作成できること', async () => {
      await runInTransaction(async (tx) => {
        const repository = new PrismaDishRepository(tx);

        const created = await repository.create({
          name: 'Test Dish'
        });

        expect(created.name).toBe('Test Dish');
        expect(created.id).toBeDefined();
      });
    });
  });

  describe('#findById', () => {
    it('作成した料理を ID で検索できること', async () => {
      await runInTransaction(async (tx) => {
        const repository = new PrismaDishRepository(tx);

        const created = await repository.create({
          name: 'Dish A'
        });

        const found = await repository.findById(created.id);
        expect(found).not.toBeNull();
        expect(found?.name).toBe('Dish A');
      });
    });

    it('存在しない ID を渡すと null を返すこと', async () => {
      await runInTransaction(async (tx) => {
        const repository = new PrismaDishRepository(tx);

        const found = await repository.findById('999999');
        expect(found).toBeNull();
      });
    });
  });

  describe('#findAll', () => {
    it('複数の料理を取得できること', async () => {
      await runInTransaction(async (tx) => {
        const repository = new PrismaDishRepository(tx);

        await repository.create({ name: 'Dish1' });
        await repository.create({ name: 'Dish2' });

        const list = await repository.findAll();

        expect(list.length).toBe(2);
        expect(list[0].name).toBe('Dish1');
        expect(list[1].name).toBe('Dish2');
      });
    });
  });

  describe('#update', () => {
    it('料理名を更新できること', async () => {
      await runInTransaction(async (tx) => {
        const repository = new PrismaDishRepository(tx);

        const created = await repository.create({ name: 'Old Name' });

        const updated = await repository.update(created.id, {
          name: 'New Name'
        });

        expect(updated.name).toBe('New Name');
        expect(updated.updatedAt.getTime()).toBeGreaterThan(created.updatedAt.getTime());
      });
    });
  });

  describe('#delete', () => {
    it('料理を削除できること', async () => {
      await runInTransaction(async (tx) => {
        const repository = new PrismaDishRepository(tx);

        const created = await repository.create({ name: 'Delete Me' });

        const result = await repository.delete(created.id);
        expect(result).toBe(true);

        const after = await repository.findById(created.id);
        expect(after).toBeNull();
      });
    });
  });

  describe('#findByName', () => {
    it('部分一致で検索できること', async () => {
      await runInTransaction(async (tx) => {
        const repository = new PrismaDishRepository(tx);

        await repository.create({ name: 'Pasta' });
        await repository.create({ name: 'Pasta Special' });
        await repository.create({ name: 'Pizza' });

        const list = await repository.findByName('Pasta');
        expect(list.length).toBe(2);
      });
    });
  });

  describe('#count', () => {
    it('料理の総数を取得できること', async () => {
      await runInTransaction(async (tx) => {
        const repository = new PrismaDishRepository(tx);

        await repository.create({ name: 'Dish1' });
        await repository.create({ name: 'Dish2' });

        const count = await repository.count();
        expect(count).toBe(2);
      });
    });
  });
});

