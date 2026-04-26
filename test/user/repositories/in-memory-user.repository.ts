/* eslint-disable @typescript-eslint/require-await */
import { UserRepository } from '@modules/user/domain/contracts/repositories/user.repository';
import { User } from '@modules/user/domain/entities/user';
import { PaginatedResult } from '@shared/domain/contracts/paginated-result';

export class InMemoryUserRepository implements UserRepository {
  public users: User[] = [];

  async create(user: User): Promise<void> {
    this.users.push(user);
  }

  async save(user: User): Promise<void> {
    const raw = this.users.findIndex(data => data.id.equals(user.id));

    if (raw >= 0) this.users[raw] = user;
  }

  async delete(userId: string): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id.value !== userId);

    return this.users.length < initialLength;
  }

  async findById(userId: string): Promise<User | null> {
    const user = this.users.find(user => user.id.value === userId);

    return user ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(user => user.email.value === email);

    return user ?? null;
  }

  async findAll(page: number, limit: number): Promise<PaginatedResult<User>> {
    const total = this.users.length;
    const lastPage = total === 0 ? 1 : Math.ceil(total / limit);
    const data = this.users.slice((page - 1) * limit, page * limit);
    return { items: data, total, page, limit, lastPage };
  }
}
