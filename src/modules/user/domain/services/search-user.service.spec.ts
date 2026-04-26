import { beforeEach, describe, expect, it } from 'vitest';
import { SearchUserService } from './search-user.service';
import { InMemoryUserRepository } from '@test/user/repositories/in-memory-user.repository';
import { makeUser } from '@test/user/factories/user-factory';
import { UserNotFoundException } from '@modules/user/exceptions/user-not-found.exception';

let searchUserService: SearchUserService;
let inMemoryUserRepository: InMemoryUserRepository;

describe('SearchUserService', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    searchUserService = new SearchUserService(inMemoryUserRepository);
  });

  it('should return a user when found by id', async () => {
    const user = makeUser();

    await inMemoryUserRepository.create(user);

    const response = await searchUserService.execute({
      userId: user.id.value,
    });

    expect(response.user).toBe(user);
  });

  it('should throw when user is not found', async () => {
    await expect(
      searchUserService.execute({
        userId: 'non-existent-user-id',
      }),
    ).rejects.toThrow(UserNotFoundException);
  });
});
