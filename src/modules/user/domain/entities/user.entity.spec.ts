import { describe, expect, it } from 'vitest';

import { makeUser } from '@test/user/factories/user.factory';

describe('User Unit Tests', () => {
  it('should create a user', () => {
    const user = makeUser();

    expect(user).toBeTruthy();
    expect(user.id).toBeDefined();
  });

  it('should be updateName method', () => {
    const user = makeUser();

    user.updateName('any_name');
    expect(user.name).toBe('any_name');
  });
  it('should be updateSurname method', () => {
    const user = makeUser();

    user.updateSurname('any_surname');
    expect(user.surname).toBe('any_surname');
  });

  it('should be updateEmail method', () => {
    const user = makeUser();

    user.updateEmail('anyemail@mail.com');
    expect(user.email).toBe('anyemail@mail.com');
  });

  it('should be updatePassword method', () => {
    const user = makeUser();

    user.updatePassword('new-password');
    expect(user.password).toBe('new-password');
  });

  it('should be toJson() method', () => {
    const user = makeUser();

    expect(user.toJson()).toStrictEqual({
      id: user.id,
      name: 'John Doe',
      surname: 'Doe',
      email: 'johndoe@mail.com',
      password: 'password_123',
    });
  });
});
