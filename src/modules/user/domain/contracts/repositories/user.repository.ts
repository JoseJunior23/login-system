import { PaginatedResult } from '@shared/domain/contracts/paginated-result';
import { User } from '../../entities/user';

export abstract class UserRepository {
  abstract create(user: User): Promise<void>;
  abstract save(user: User): Promise<void>;
  abstract delete(userId: string): Promise<void>;
  abstract findById(userId: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findAll(page: number, limit: number): Promise<PaginatedResult<User>>;
}
