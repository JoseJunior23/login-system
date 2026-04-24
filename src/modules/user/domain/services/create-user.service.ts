import { Email } from '@shared/domain/value-objects/email.vo';
import { Password } from './../entities/password';
import { HashedPassword } from '../entities/hashed-password';
import { User } from '../entities/user';
import { UserRepository } from '../contracts/repositories/user.repository';
import { PasswordHasher } from '../contracts/cryptography/password-hasher';
import { Injectable } from '@nestjs/common';
import { EmailConflictException } from '@modules/user/exceptions/email-conflict.exception';
interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

interface CreateUserResponse {
  user: User;
}
@Injectable()
export class CreateUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute({ email, name, password }: CreateUserRequest): Promise<CreateUserResponse> {
    const emailVO = Email.create(email);
    const passwordVO = Password.create(password);

    const registeredEmail = await this.userRepository.findByEmail(emailVO.value);
    if (registeredEmail) throw new EmailConflictException();

    const passwordHashed = await this.passwordHasher.generateHash(passwordVO.value);
    const user = User.create({
      name,
      email: emailVO,
      password: HashedPassword.create(passwordHashed),
    });
    await this.userRepository.create(user);
    return { user };
  }
}
