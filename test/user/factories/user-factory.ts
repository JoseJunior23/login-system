import { HashedPassword } from '@modules/user/domain/entities/hashed-password';
import { User, UserCreateProps, UserRoles } from '@modules/user/domain/entities/user';
import { Email } from '@shared/domain/value-objects/email.vo';
import { Id } from '@shared/domain/value-objects/id.vo';

type Override = Partial<UserCreateProps>;

export function makeUser(override: Override = {}): User {
  return User.create({
    id: Id.create(),
    name: 'John Doe',
    email: Email.create('johndoe@mail.com'),
    password: HashedPassword.create('hashed-password'),
    role: [UserRoles.USER],
    ...override,
  });
}
