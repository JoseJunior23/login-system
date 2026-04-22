import { RemoveRoleException } from '@modules/user/exceptions/remove-role.exception';
import { Email } from '@shared/domain/value-objects/email.vo';
import { describe, expect, it, vi } from 'vitest';
import { makeUser } from '../../../../../test/user/factories/user-factory';
import { Password } from './password';
import { User, UserRoles } from './user';

describe('User', () => {
  it('should create a user with USER role by default', () => {
    const user = User.create({
      name: 'John Doe',
      email: Email.create('johndoe@mail.com'),
      password: Password.create('Abc123@$'),
    });

    expect(user.role).toEqual([UserRoles.USER]);
    expect(user.hasRole(UserRoles.USER)).toBe(true);
  });

  it('should always keep USER role when creating with custom roles', () => {
    const user = makeUser({
      role: [UserRoles.ADMIN],
    });

    expect(user.role).toEqual([UserRoles.USER, UserRoles.ADMIN]);
  });

  it('should update profile fields', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-21T10:00:00.000Z'));

    const user = makeUser({
      createdAt: new Date('2026-04-20T10:00:00.000Z'),
      updatedAt: new Date('2026-04-20T10:00:00.000Z'),
    });

    vi.setSystemTime(new Date('2026-04-21T12:00:00.000Z'));

    const email = Email.create('newmail@mail.com');
    const password = Password.create('Def456@$');

    user.updateProfile({
      name: 'Jane Doe',
      email,
      password,
    });

    expect(user.name).toBe('Jane Doe');
    expect(user.email.equals(email)).toBe(true);
    expect(user.password.equals(password)).toBe(true);
    expect(user.updatedAt).toEqual(new Date('2026-04-21T12:00:00.000Z'));

    vi.useRealTimers();
  });

  it('should add a role only once', () => {
    const user = makeUser();

    user.addRole(UserRoles.ADMIN);
    user.addRole(UserRoles.ADMIN);

    expect(user.role).toEqual([UserRoles.USER, UserRoles.ADMIN]);
  });

  it('should remove a non-default role', () => {
    const user = makeUser({
      role: [UserRoles.USER, UserRoles.ADMIN],
    });

    user.removeRole(UserRoles.ADMIN);

    expect(user.role).toEqual([UserRoles.USER]);
  });

  it('should throw when trying to remove USER role', () => {
    const user = makeUser();

    expect(() => user.removeRole(UserRoles.USER)).toThrow(RemoveRoleException);
  });

  it('should protect roles from external mutation', () => {
    const user = makeUser();
    const roles = user.role;

    roles.push(UserRoles.ADMIN);

    expect(user.role).toEqual([UserRoles.USER]);
    expect(user.hasRole(UserRoles.ADMIN)).toBe(false);
  });

  it('should normalize roles when updating them', () => {
    const user = makeUser();

    user.updateRole([UserRoles.ADMIN, UserRoles.ADMIN]);

    expect(user.role).toEqual([UserRoles.USER, UserRoles.ADMIN]);
  });
});
