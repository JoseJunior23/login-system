import { describe, expect, it } from 'vitest';
import { InvalidEmailException } from './exceptions/invalid-email.exception';
import { Email } from './email.vo';

describe('Email', () => {
  it('should create a valid email', () => {
    const email = Email.create('john.doe@example.com');

    expect(email.value).toBe('john.doe@example.com');
  });

  it('should normalize email by trimming spaces and converting to lowercase', () => {
    const email = Email.create('  John.Doe@Example.COM  ');

    expect(email.value).toBe('john.doe@example.com');
    expect(email.toString()).toBe('john.doe@example.com');
  });

  it('should throw when email is invalid', () => {
    expect(() => Email.create('invalid-email')).toThrow(InvalidEmailException);
  });

  it('should compare equal emails correctly', () => {
    const firstEmail = Email.create('John.Doe@Example.COM');
    const secondEmail = Email.create('  john.doe@example.com ');

    expect(firstEmail.equals(secondEmail)).toBe(true);
  });

  it('should compare different emails correctly', () => {
    const firstEmail = Email.create('john.doe@example.com');
    const secondEmail = Email.create('jane.doe@example.com');

    expect(firstEmail.equals(secondEmail)).toBe(false);
  });
});
