import { beforeEach, describe, expect, it } from 'vitest';
import { Email } from '@shared/domain/value-objects/email.vo';
import { HashedPassword } from '../entities/hashed-password';
import { UpdateUserService } from './update-user.service';
import { InMemoryUserRepository } from '@test/user/repositories/in-memory-user.repository';
import { FakePasswordHash } from '@test/user/repositories/fake-password-hash';
import { makeUser } from '@test/user/factories/user-factory';
import { InvalidUserIdException } from '@modules/user/exceptions/invalid-user-id.exception';
import { UserNotFoundException } from '@modules/user/exceptions/user-not-found.exception';
import { UserConflictException } from '@modules/user/exceptions/user-conflict.exception';
import { UserPasswordRequiredException } from '@modules/user/exceptions/user-password-required.exception';
import { UserPasswordNotMatchException } from '@modules/user/exceptions/user-password-not-match.exception';

let updateUserService: UpdateUserService;
let inMemoryUserRepository: InMemoryUserRepository;
let fakePasswordHash: FakePasswordHash;

describe('UpdateUserService', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    fakePasswordHash = new FakePasswordHash();
    updateUserService = new UpdateUserService(inMemoryUserRepository, fakePasswordHash);
  });

  it('should update user name and email', async () => {
    const user = makeUser();

    await inMemoryUserRepository.create(user);

    const response = await updateUserService.execute({
      userId: user.id.value,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    });

    expect(response.user).toBe(user);
    expect(response.user.name).toBe('Jane Doe');
    expect(response.user.email.value).toBe('jane.doe@example.com');
  });

  it('should update user password when old password matches', async () => {
    const user = makeUser({
      password: HashedPassword.create('hashed:OldPass1!'),
    });

    await inMemoryUserRepository.create(user);

    const response = await updateUserService.execute({
      userId: user.id.value,
      password: 'NewPass1!',
      oldPassword: 'OldPass1!',
    });

    expect(response.user).toBe(user);
    expect(response.user.password.value).toBe('hashed:NewPass1!');
  });

  it('should throw when user id is not provided', async () => {
    await expect(
      updateUserService.execute({
        userId: '',
      }),
    ).rejects.toThrow(InvalidUserIdException);
  });

  it('should throw when user is not found', async () => {
    await expect(
      updateUserService.execute({
        userId: 'non-existent-user-id',
      }),
    ).rejects.toThrow(UserNotFoundException);
  });

  it('should throw when email is already in use by another user', async () => {
    const user = makeUser({
      email: Email.create('john.doe@example.com'),
    });
    const registeredUser = makeUser({
      email: Email.create('jane.doe@example.com'),
    });

    await inMemoryUserRepository.create(user);
    await inMemoryUserRepository.create(registeredUser);

    await expect(
      updateUserService.execute({
        userId: user.id.value,
        email: 'jane.doe@example.com',
      }),
    ).rejects.toThrow(UserConflictException);
  });

  it('should throw when trying to update password without old password', async () => {
    const user = makeUser({
      password: HashedPassword.create('hashed:OldPass1!'),
    });

    await inMemoryUserRepository.create(user);

    await expect(
      updateUserService.execute({
        userId: user.id.value,
        password: 'NewPass1!',
      }),
    ).rejects.toThrow(UserPasswordRequiredException);
  });

  it('should throw when old password does not match', async () => {
    const user = makeUser({
      password: HashedPassword.create('hashed:OldPass1!'),
    });

    await inMemoryUserRepository.create(user);

    await expect(
      updateUserService.execute({
        userId: user.id.value,
        password: 'NewPass1!',
        oldPassword: 'WrongPass1!',
      }),
    ).rejects.toThrow(UserPasswordNotMatchException);
  });
});
