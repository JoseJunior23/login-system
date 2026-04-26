import { Injectable } from '@nestjs/common';
import { UserRepository } from '../contracts/repositories/user.repository';
import { UserNotFoundException } from '@modules/user/exceptions/user-not-found.exception';
import { InvalidUserIdException } from '@modules/user/exceptions/invalid-user-id.exception';

interface deleteUserRequest {
  userId: string;
}

@Injectable()
export class DeleteUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId }: deleteUserRequest): Promise<void> {
    if (!userId) throw new InvalidUserIdException();

    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException();

    await this.userRepository.delete(user.id.value);
  }
}
