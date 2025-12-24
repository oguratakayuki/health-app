// src/infrastructure/repositories/prisma/__tests__/UserRepository.spec.ts
import { UserRepository } from '../UserRepository';
import { CreateUserInput, UpdateUserInput } from '@/src/domain/entities/User';
import { runInTransaction } from '../../../../../test-transaction';

describe('UserRepository', () => {
  //
  // ----------------------------
  // #findByEmail
  // ----------------------------
  //
  describe('#findByEmail', () => {
    it('ユーザーを作成して検索できること', async () => {
      await runInTransaction(async (tx) => {
        const repository = new UserRepository(tx);

        const email = `test_${Date.now()}@example.com`;

        await repository.create({
          email,
          name: 'Test User',
          cognitoSub: 'test_sub',
        });

        const found = await repository.findByEmail(email);
        expect(found).not.toBeNull();
        expect(found?.email).toBe(email);
      });
    });

    it('存在しないメールアドレスはnullを返すこと', async () => {
      await runInTransaction(async (tx) => {
        const repository = new UserRepository(tx);

        const found = await repository.findByEmail('nonexistent@example.com');
        expect(found).toBeNull();
      });
    });
  });

  //
  // ----------------------------
  // #create
  // ----------------------------
  //
  describe('#create', () => {
    it('新しいユーザーを作成できること', async () => {
      await runInTransaction(async (tx) => {
        const repository = new UserRepository(tx);

        const input: CreateUserInput = {
          email: `new_${Date.now()}@example.com`,
          name: 'New User',
        };

        const result = await repository.create(input);

        expect(result.email).toBe(input.email);
        expect(result.name).toBe(input.name);
        expect(result.isAdmin).toBe(false);
        expect(result.createdAt).toBeInstanceOf(Date);
      });
    });

    // it('重複メールアドレスでエラーを投げること', async () => {
    //   await runInTransaction(async (tx) => {
    //     const repository = new UserRepository(tx);

    //     const email = `duplicate_${Date.now()}@example.com`;

    //     await repository.create({ email, name: 'First' });

    //     await expect(
    //       repository.create({ email, name: 'Second' })
    //     ).rejects.toThrow();
    //   });
    // });
  });

  //
  // ----------------------------
  // #update
  // ----------------------------
  //
  describe('#update', () => {
    it('ユーザーを更新できること', async () => {
      await runInTransaction(async (tx) => {
        const repository = new UserRepository(tx);

        const email = `update_${Date.now()}@example.com`;

        const user = await repository.create({
          email,
          name: 'Original Name',
          cognitoSub: 'original_sub',
        });

        const updateInput: UpdateUserInput = {
          name: 'Updated Name',
          isAdmin: true,
        };

        const updated = await repository.update(user.id, updateInput);

        expect(updated.name).toBe('Updated Name');
        expect(updated.isAdmin).toBe(true);
        expect(updated.updatedAt.getTime()).toBeGreaterThan(
          user.updatedAt.getTime()
        );
      });
    });
  });

  //
  // ----------------------------
  // #findAll
  // ----------------------------
  //
  describe('#findAll', () => {
    it('複数ユーザーを取得できること', async () => {
      await runInTransaction(async (tx) => {
        const repository = new UserRepository(tx);

        await repository.create({
          email: `user1_${Date.now()}@example.com`,
          name: 'User 1',
        });
        await repository.create({
          email: `user2_${Date.now()}@example.com`,
          name: 'User 2',
        });

        const users = await repository.findAll();

        expect(users.length).toBe(2);
        expect(users[0].name).toBe('User 1');
        expect(users[1].name).toBe('User 2');
      });
    });
  });
});

