import { Password } from '@modules/user/domain/entities/password';
import { User, UserCreateProps, UserRoles } from '@modules/user/domain/entities/user';
import { Email } from '@shared/domain/value-objects/email.vo';
import { Id } from '@shared/domain/value-objects/id.vo';

type Override = Partial<UserCreateProps>;

export function makeUser(override: Override = {}): User {
  return User.create({
    id: Id.create(),
    name: 'John Doe',
    email: Email.create('johndoe@mail.com'),
    password: Password.create('Abc123@$'),
    role: [UserRoles.USER],
    ...override,
  });
}
