import { Injectable } from '@nestjs/common';
import { User, UserRoles } from '../entities/user';
import { UserRepository } from '../contracts/repositories/user.repository';
import { UserNotFoundException } from '@modules/user/exceptions/user-not-found.exception';
import { InvalidUserIdException } from '@modules/user/exceptions/invalid-user-id.exception';

interface SetUserRoleRequest {
  userId: string;
  roles: UserRoles[];
}

interface SetUserRoleResponse {
  user: User;
}

@Injectable()
export class SetUserRoleService {
  constructor(private readonly userRepository: UserRepository) {}
  async execute({ userId, roles }: SetUserRoleRequest): Promise<SetUserRoleResponse> {
    if (!userId) throw new InvalidUserIdException();

    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException();

    user.updateRole(roles);
    await this.userRepository.save(user);

    return {
      user,
    };
  }
}
