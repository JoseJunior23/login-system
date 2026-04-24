import { EmailConflictException } from '@modules/user/exceptions/email-conflict.exception';
import { InvalidPasswordException } from '@modules/user/exceptions/invalid-password.exception';
import { InvalidEmailException } from '@shared/domain/value-objects/exceptions/invalid-email.exception';
import { Email } from '@shared/domain/value-objects/email.vo';
import { beforeEach, describe, expect, it } from 'vitest';
import { HashedPassword } from '../entities/hashed-password';
import { User } from '../entities/user';
import { CreateUserService } from './create-user.service';
import { InMemoryUserRepository } from '@test/user/repositories/in-memory-user.repository';
import { FakePasswordHash } from '@test/user/repositories/fake-password-hash';

let createUserService: CreateUserService;
let inMemoryUserRepository: InMemoryUserRepository;
let fakePasswordHash: FakePasswordHash;

describe('CreateUserService', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    fakePasswordHash = new FakePasswordHash();
    createUserService = new CreateUserService(inMemoryUserRepository, fakePasswordHash);
  });

  it('should create a user with hashed password', async () => {
    const response = await createUserService.execute({
      name: 'John Doe',
      email: 'John.Doe@Example.COM',
      password: 'Abc123@$',
    });

    expect(response.user.name).toBe('John Doe');
    expect(response.user.email.value).toBe('john.doe@example.com');
    expect(response.user.password.value).toBe('hashed:Abc123@$');
    expect(response.user.password.value).not.toBe('Abc123@$');
    expect(inMemoryUserRepository.users).toHaveLength(1);
    expect(inMemoryUserRepository.users[0]).toBe(response.user);
  });

  it('should throw when email is already registered', async () => {
    await inMemoryUserRepository.create(
      User.create({
        name: 'Existing User',
        email: Email.create('john.doe@example.com'),
        password: HashedPassword.create('existing-password'),
      }),
    );

    await expect(
      createUserService.execute({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'Abc123@$',
      }),
    ).rejects.toThrow(EmailConflictException);

    expect(inMemoryUserRepository.users).toHaveLength(1);
    expect(inMemoryUserRepository.users[0].email.value).toBe('john.doe@example.com');
  });

  it('should throw when email is invalid', async () => {
    await expect(
      createUserService.execute({
        name: 'John Doe',
        email: 'invalid-email',
        password: 'Abc123@$',
      }),
    ).rejects.toThrow(InvalidEmailException);

    expect(inMemoryUserRepository.users).toHaveLength(0);
  });

  it('should throw when password is invalid', async () => {
    await expect(
      createUserService.execute({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'weak',
      }),
    ).rejects.toThrow(InvalidPasswordException);

    expect(inMemoryUserRepository.users).toHaveLength(0);
  });
});
