import { beforeEach, describe, expect, it } from 'vitest';
import { Email } from '@shared/domain/value-objects/email.vo';
import { ListUsersService } from './list-users.service';
import { InMemoryUserRepository } from '@test/user/repositories/in-memory-user.repository';
import { makeUser } from '@test/user/factories/user-factory';

let listUsersService: ListUsersService;
let inMemoryUserRepository: InMemoryUserRepository;

describe('ListUsersService', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    listUsersService = new ListUsersService(inMemoryUserRepository);
  });

  it('should list users with pagination metadata', async () => {
    const firstUser = makeUser({
      name: 'John Doe',
      email: Email.create('john.doe@example.com'),
    });
    const secondUser = makeUser({
      name: 'Jane Doe',
      email: Email.create('jane.doe@example.com'),
    });

    await inMemoryUserRepository.create(firstUser);
    await inMemoryUserRepository.create(secondUser);

    const response = await listUsersService.execute();

    expect(response.users).toEqual([firstUser, secondUser]);
    expect(response.total).toBe(2);
    expect(response.page).toBe(1);
    expect(response.limit).toBe(10);
    expect(response.lastPage).toBe(1);
  });

  it('should return only users from the requested page', async () => {
    const firstUser = makeUser({
      name: 'John Doe',
      email: Email.create('john.doe@example.com'),
    });
    const secondUser = makeUser({
      name: 'Jane Doe',
      email: Email.create('jane.doe@example.com'),
    });
    const thirdUser = makeUser({
      name: 'Mary Doe',
      email: Email.create('mary.doe@example.com'),
    });

    await inMemoryUserRepository.create(firstUser);
    await inMemoryUserRepository.create(secondUser);
    await inMemoryUserRepository.create(thirdUser);

    const response = await listUsersService.execute(2, 2);

    expect(response.users).toEqual([thirdUser]);
    expect(response.total).toBe(3);
    expect(response.page).toBe(2);
    expect(response.limit).toBe(2);
    expect(response.lastPage).toBe(2);
  });

  it('should not expose repository items property in the response', async () => {
    await inMemoryUserRepository.create(
      makeUser({
        name: 'John Doe',
        email: Email.create('john.doe@example.com'),
      }),
    );

    const response = await listUsersService.execute();

    expect(response).not.toHaveProperty('items');
    expect(response.users).toHaveLength(1);
  });
});
