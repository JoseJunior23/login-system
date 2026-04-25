import { Injectable } from '@nestjs/common';
import { User } from '../entities/user';
import { UserRepository } from '../contracts/repositories/user.repository';

interface ListUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}
@Injectable()
export class ListUsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(page = 1, limit = 10): Promise<ListUsersResponse> {
    const { items, total, lastPage } = await this.userRepository.findAll(page, limit);

    return {
      users: items,
      total,
      page,
      limit,
      lastPage,
    };
  }
}
