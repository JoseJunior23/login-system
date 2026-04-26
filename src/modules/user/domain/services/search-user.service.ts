import { Injectable } from '@nestjs/common';
import { UserRepository } from '../contracts/repositories/user.repository';
import { User } from '../entities/user';
import { UserNotFoundException } from '@modules/user/exceptions/user-not-found.exception';

interface SearchUserRequest {
  userId: string;
}

interface SearchUserResponse {
  user: User;
}
@Injectable()
export class SearchUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId }: SearchUserRequest): Promise<SearchUserResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException();

    return { user };
  }
}
