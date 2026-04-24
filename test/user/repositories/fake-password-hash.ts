/* eslint-disable @typescript-eslint/require-await */
import { PasswordHasher } from '@modules/user/domain/contracts/cryptography/password-hasher';

export class FakePasswordHash implements PasswordHasher {
  async generateHash(password: string): Promise<string> {
    return `hashed:${password}`;
  }
  async compareHash(password: string, hashedPassword: string): Promise<boolean> {
    return hashedPassword === `hashed:${password}`;
  }
}
