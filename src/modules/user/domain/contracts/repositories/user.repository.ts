import { User } from '../../entities/user';

export abstract class UserRepository {
  abstract create(user: User): Promise<void>;
  abstract save(user: User): Promise<void>;
  abstract delete(userId: string): Promise<void>;
  abstract findById(userId: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
}
