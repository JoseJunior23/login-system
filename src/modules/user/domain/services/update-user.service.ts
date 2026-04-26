import { Injectable } from '@nestjs/common';
import { UserRepository } from '../contracts/repositories/user.repository';
import { User } from '../entities/user';
import { PasswordHasher } from '../contracts/cryptography/password-hasher';
import { InvalidUserIdException } from '@modules/user/exceptions/invalid-user-id.exception';
import { UserNotFoundException } from '@modules/user/exceptions/user-not-found.exception';
import { UserConflictException } from '@modules/user/exceptions/user-conflict.exception';
import { UserPasswordRequiredException } from '@modules/user/exceptions/user-password-required.exception';
import { UserPasswordNotMatchException } from '@modules/user/exceptions/user-password-not-match.exception';
import { Password } from '../entities/password';
import { Email } from '@shared/domain/value-objects/email.vo';
import { HashedPassword } from '../entities/hashed-password';

interface UpdateUserRequest {
  userId: string;
  name?: string;
  email?: string;
  password?: string;
  oldPassword?: string;
}

interface UpdateUserResponse {
  user: User;
}
@Injectable()
export class UpdateUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute({
    email,
    name,
    oldPassword,
    password,
    userId,
  }: UpdateUserRequest): Promise<UpdateUserResponse> {
    if (!userId) throw new InvalidUserIdException();

    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException();

    if (email !== undefined && email !== user.email.value) {
      const registeredEmail = await this.userRepository.findByEmail(email);
      if (registeredEmail && !registeredEmail.id.equals(user.id)) throw new UserConflictException();
    }

    if (password !== undefined) {
      if (oldPassword === undefined) throw new UserPasswordRequiredException();

      const oldPasswordCorrect = await this.passwordHasher.compareHash(
        oldPassword,
        user.password.value,
      );
      if (!oldPasswordCorrect) throw new UserPasswordNotMatchException();

      const passwordVO = Password.create(password);
      const passwordHashed = await this.passwordHasher.generateHash(passwordVO.value);
      user.updatePassword(HashedPassword.create(passwordHashed));
    }

    const updatedUser: {
      name?: string;
      email?: Email;
    } = {};

    if (name !== undefined) updatedUser.name = name;
    if (email !== undefined) updatedUser.email = Email.create(email);
    if (Object.keys(updatedUser).length > 0) user.updateProfile(updatedUser);

    await this.userRepository.save(user);

    return { user };
  }
}
