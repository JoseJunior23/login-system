import { describe, expect, it } from 'vitest';
import { InvalidPasswordException } from './exceptions/invalid-password.exception';
import { Password } from './password.vo';

describe('Password', () => {
  it('should create a valid password', () => {
    const password = Password.create('Abc123@$');

    expect(password.value).toBe('Abc123@$');
    expect(password.toString()).toBe('Abc123@$');
  });

  it('should throw when password has less than 8 characters', () => {
    expect(() => Password.create('Ab1@cd')).toThrow(InvalidPasswordException);
  });

  it('should throw when password has no lowercase letter', () => {
    expect(() => Password.create('ABC123@#')).toThrow(InvalidPasswordException);
  });

  it('should throw when password has no uppercase letter', () => {
    expect(() => Password.create('abc123@#')).toThrow(InvalidPasswordException);
  });

  it('should throw when password has no number', () => {
    expect(() => Password.create('Abcdef@#')).toThrow(InvalidPasswordException);
  });

  it('should throw when password has no special character', () => {
    expect(() => Password.create('Abc12345')).toThrow(InvalidPasswordException);
  });

  it('should throw when password contains spaces', () => {
    expect(() => Password.create('Abc 123@')).toThrow(InvalidPasswordException);
    expect(() => Password.create(' Abc123@')).toThrow(InvalidPasswordException);
    expect(() => Password.create('Abc123@ ')).toThrow(InvalidPasswordException);
  });

  it('should compare equal passwords correctly', () => {
    const firstPassword = Password.create('Abc123@$');
    const secondPassword = Password.create('Abc123@$');

    expect(firstPassword.equals(secondPassword)).toBe(true);
  });

  it('should compare different passwords correctly', () => {
    const firstPassword = Password.create('Abc123@$');
    const secondPassword = Password.create('Abc123$%');

    expect(firstPassword.equals(secondPassword)).toBe(false);
  });

  it('should return false when comparing with undefined', () => {
    const password = Password.create('Abc123@$');

    expect(password.equals(undefined)).toBe(false);
  });
});
