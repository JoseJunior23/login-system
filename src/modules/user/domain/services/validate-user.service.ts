import { Injectable } from '@nestjs/common';
import { User } from '../entities/user';
import { UserRepository } from '../contracts/repositories/user.repository';
import { PasswordHasher } from '../contracts/cryptography/password-hasher';
import { UserUnauthorizedException } from '@modules/user/exceptions/user-unauthorized.exception';
import { Email } from '@shared/domain/value-objects/email.vo';
import { Password } from '../entities/password';

interface ValidateUserRequest {
  email: string;
  password: string;
}

interface ValidateUserResponse {
  user: User;
}

@Injectable()
export class ValidateUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute({ email, password }: ValidateUserRequest): Promise<ValidateUserResponse> {
    const emailVO = Email.create(email);
    const passwordVO = Password.create(password);

    const user = await this.userRepository.findByEmail(emailVO.value);
    if (!user) throw new UserUnauthorizedException();

    const passwordMatched = await this.passwordHasher.compareHash(
      passwordVO.value,
      user.password.value,
    );
    if (!passwordMatched) throw new UserUnauthorizedException();

    return { user };
  }
}
