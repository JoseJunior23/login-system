import { User, UserProps } from '@modules/user/domain/entities/user.entity';

type Override = Partial<UserProps>;
export function makeUser(override: Override = {}): User {
  return User.create({
    name: 'John Doe',
    surname: 'Doe',
    email: 'johndoe@mail.com',
    password: 'password_123',
    ...override,
  });
}
