export abstract class PasswordHasher {
  abstract generateHash(password: string): Promise<string>;
  abstract compareHash(password: string, hashedPassword: string): Promise<boolean>;
}
