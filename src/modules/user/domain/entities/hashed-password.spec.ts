import { describe, expect, it } from 'vitest';
import { HashedPassword } from './hashed-password';

describe('HashedPassword', () => {
  it('should create a hashed password', () => {
    const hashedPassword = HashedPassword.create('hashed-password');

    expect(hashedPassword.value).toBe('hashed-password');
    expect(hashedPassword.toString()).toBe('hashed-password');
  });

  it('should compare equal hashed passwords correctly', () => {
    const firstHashedPassword = HashedPassword.create('hashed-password');
    const secondHashedPassword = HashedPassword.create('hashed-password');

    expect(firstHashedPassword.equals(secondHashedPassword)).toBe(true);
  });

  it('should compare different hashed passwords correctly', () => {
    const firstHashedPassword = HashedPassword.create('hashed-password');
    const secondHashedPassword = HashedPassword.create('another-hashed-password');

    expect(firstHashedPassword.equals(secondHashedPassword)).toBe(false);
  });

  it('should return false when comparing with undefined', () => {
    const hashedPassword = HashedPassword.create('hashed-password');

    expect(hashedPassword.equals(undefined)).toBe(false);
  });
});
