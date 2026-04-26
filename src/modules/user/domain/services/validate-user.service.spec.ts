import { beforeEach, describe, expect, it } from 'vitest';
import { ValidateUserService } from './validate-user.service';
import { InMemoryUserRepository } from '@test/user/repositories/in-memory-user.repository';
import { FakePasswordHash } from '@test/user/repositories/fake-password-hash';
import { makeUser } from '@test/user/factories/user-factory';
import { UserUnauthorizedException } from '@modules/user/exceptions/user-unauthorized.exception';
import { HashedPassword } from '../entities/hashed-password';
import { InvalidPasswordException } from '@modules/user/exceptions/invalid-password.exception';
import { InvalidEmailException } from '@shared/domain/value-objects/exceptions/invalid-email.exception';

let validateUserService: ValidateUserService;
let inMemoryUserRepository: InMemoryUserRepository;
let fakePasswordHash: FakePasswordHash;

describe('ValidateUserService', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    fakePasswordHash = new FakePasswordHash();
    validateUserService = new ValidateUserService(inMemoryUserRepository, fakePasswordHash);
  });

  it('should return the user when email and password are valid', async () => {
    const user = makeUser({
      password: HashedPassword.create('hashed:Abc123@$'),
    });

    await inMemoryUserRepository.create(user);

    const response = await validateUserService.execute({
      email: user.email.value,
      password: 'Abc123@$',
    });

    expect(response.user).toBe(user);
  });

  it('should throw when email is not registered', async () => {
    await expect(
      validateUserService.execute({
        email: 'john.doe@example.com',
        password: 'Abc123@$',
      }),
    ).rejects.toThrow(UserUnauthorizedException);
  });

  it('should throw when password does not match', async () => {
    const user = makeUser({
      password: HashedPassword.create('hashed:Abc123@$'),
    });

    await inMemoryUserRepository.create(user);

    await expect(
      validateUserService.execute({
        email: user.email.value,
        password: 'Wrong123!',
      }),
    ).rejects.toThrow(UserUnauthorizedException);
  });

  it('should throw when email is invalid', async () => {
    await expect(
      validateUserService.execute({
        email: 'invalid-email',
        password: 'Abc123@$',
      }),
    ).rejects.toThrow(InvalidEmailException);
  });

  it('should throw when password is invalid', async () => {
    await expect(
      validateUserService.execute({
        email: 'john.doe@example.com',
        password: 'weak',
      }),
    ).rejects.toThrow(InvalidPasswordException);
  });
});
