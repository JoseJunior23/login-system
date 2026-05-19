import { InvalidUserIdException } from '@modules/user/exceptions/invalid-user-id.exception';
import { UserNotFoundException } from '@modules/user/exceptions/user-not-found.exception';
import { makeUser } from '@test/user/factories/user-factory';
import { InMemoryUserRepository } from '@test/user/repositories/in-memory-user.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserRoles } from '../entities/user';
import { SetUserRoleService } from './set-user-role.service';

let setUserRoleService: SetUserRoleService;
let inMemoryUserRepository: InMemoryUserRepository;

describe('SetUserRoleService', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    setUserRoleService = new SetUserRoleService(inMemoryUserRepository);
  });

  it('should update user roles successfully and persist the change', async () => {
    const user = makeUser();

    await inMemoryUserRepository.create(user);

    const newRoles: UserRoles[] = [UserRoles.ADMIN];

    const response = await setUserRoleService.execute({
      userId: user.id.value,
      roles: newRoles,
    });

    expect(response.user.role).toEqual([UserRoles.USER, UserRoles.ADMIN]);

    const persistedUser = await inMemoryUserRepository.findById(user.id.value);
    expect(persistedUser).not.toBeNull();
    expect(persistedUser?.role).toEqual([UserRoles.USER, UserRoles.ADMIN]);
  });

  it('should throw when user is not found', async () => {
    await expect(
      setUserRoleService.execute({
        userId: 'non-existent-user-id',
        roles: [UserRoles.ADMIN],
      }),
    ).rejects.toThrow(UserNotFoundException);
  });

  it('should throw when userId is invalid', async () => {
    await expect(
      setUserRoleService.execute({
        userId: '',
        roles: [UserRoles.ADMIN],
      }),
    ).rejects.toThrow(InvalidUserIdException);
  });

  it('should normalize roles to include USER and remove duplicates', async () => {
    const user = makeUser();

    await inMemoryUserRepository.create(user);

    const newRoles: UserRoles[] = [UserRoles.ADMIN, UserRoles.USER, UserRoles.ADMIN];

    const response = await setUserRoleService.execute({
      userId: user.id.value,
      roles: newRoles,
    });

    expect(response.user.role).toEqual([UserRoles.USER, UserRoles.ADMIN]);
  });

  it('should set default USER role when roles array is empty', async () => {
    const user = makeUser();

    await inMemoryUserRepository.create(user);

    const response = await setUserRoleService.execute({
      userId: user.id.value,
      roles: [],
    });

    expect(response.user.role).toEqual([UserRoles.USER]);
  });

  it('should preserve USER role when only USER is passed', async () => {
    const user = makeUser();

    await inMemoryUserRepository.create(user);

    const response = await setUserRoleService.execute({
      userId: user.id.value,
      roles: [UserRoles.USER],
    });

    expect(response.user.role).toEqual([UserRoles.USER]);
  });

  it('should call save on the repository after updating roles', async () => {
    const user = makeUser();

    await inMemoryUserRepository.create(user);

    const saveSpy = vi.spyOn(inMemoryUserRepository, 'save');

    await setUserRoleService.execute({
      userId: user.id.value,
      roles: [UserRoles.ADMIN],
    });

    expect(saveSpy).toHaveBeenCalledWith(user);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw UserNotFoundException for non-existing userId', async () => {
    await expect(
      setUserRoleService.execute({
        userId: 'invalid-uuid-format',
        roles: [UserRoles.ADMIN],
      }),
    ).rejects.toThrow(UserNotFoundException);
  });
});
