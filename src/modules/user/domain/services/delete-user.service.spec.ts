import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteUserService } from './delete-user.service';
import { InMemoryUserRepository } from '@test/user/repositories/in-memory-user.repository';
import { makeUser } from '@test/user/factories/user-factory';
import { InvalidUserIdException } from '@modules/user/exceptions/invalid-user-id.exception';
import { UserNotFoundException } from '@modules/user/exceptions/user-not-found.exception';

let deleteUserService: DeleteUserService;
let inMemoryUserRepository: InMemoryUserRepository;

describe('DeleteUserService', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    deleteUserService = new DeleteUserService(inMemoryUserRepository);
  });

  it('should delete user', async () => {
    const user = makeUser();

    await inMemoryUserRepository.create(user);

    await deleteUserService.execute({
      userId: user.id.value,
    });

    expect(inMemoryUserRepository.users).toHaveLength(0);
    await expect(inMemoryUserRepository.findById(user.id.value)).resolves.toBeNull();
  });

  it('should throw when user id is not provided', async () => {
    await expect(
      deleteUserService.execute({
        userId: '',
      }),
    ).rejects.toThrow(InvalidUserIdException);
  });

  it('should throw when user is not found', async () => {
    await expect(
      deleteUserService.execute({
        userId: '2a7e9d30-7d0f-4cb7-b449-a7d9ddfafe11',
      }),
    ).rejects.toThrow(UserNotFoundException);
  });
});
