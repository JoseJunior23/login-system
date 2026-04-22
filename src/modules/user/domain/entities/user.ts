import { Email } from '@shared/domain/value-objects/email.vo';
import { Password } from './password';
import { BaseEntity } from '@shared/domain/entities/base.entity';
import { Replace } from '@shared/domain/helpers/replace.helper';
import { RemoveRoleException } from '@modules/user/exceptions/remove-role.exception';
import { Id } from '@shared/domain/value-objects/id.vo';

export enum UserRoles {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
export interface UserProps {
  name: string;
  email: Email;
  password: Password;
  role: UserRoles[];
}

export type UserCreateProps = Replace<
  UserProps,
  {
    id?: Id;
    createdAt?: Date;
    updatedAt?: Date;
    role?: UserRoles[];
  }
>;

export class User extends BaseEntity {
  private userProps: UserProps;

  private constructor(props: UserCreateProps) {
    super(props);
    this.userProps = {
      name: props.name,
      email: props.email,
      password: props.password,
      role: User.normalizeRoles(props.role),
    };
  }

  static create(props: UserCreateProps): User {
    return new User(props);
  }

  private static normalizeRoles(roles?: UserRoles[]): UserRoles[] {
    const normalizedRoles = roles?.length ? roles : [UserRoles.USER];

    return Array.from(new Set([UserRoles.USER, ...normalizedRoles]));
  }

  get name(): string {
    return this.userProps.name;
  }

  updateName(name: string): void {
    this.userProps.name = name;
    this.touch();
  }

  get email(): Email {
    return this.userProps.email;
  }

  public updateEmail(email: Email): void {
    this.userProps.email = email;
    this.touch();
  }

  get password(): Password {
    return this.userProps.password;
  }

  updatePassword(password: Password): void {
    this.userProps.password = password;
    this.touch();
  }

  get role(): UserRoles[] {
    return [...this.userProps.role];
  }

  set role(role: UserRoles[]) {
    this.updateRole(role);
  }

  public updateRole(role: UserRoles[]): void {
    this.userProps.role = User.normalizeRoles(role);
    this.touch();
  }

  public addRole(role: UserRoles): void {
    this.userProps.role = User.normalizeRoles([...this.userProps.role, role]);
    this.touch();
  }

  public removeRole(role: UserRoles): void {
    if (role === UserRoles.USER) {
      throw new RemoveRoleException();
    }
    this.userProps.role = this.userProps.role.filter(r => r !== role);
    this.touch();
  }

  public hasRole(role: UserRoles): boolean {
    return this.userProps.role.includes(role);
  }

  public updateProfile(props: Partial<UserProps>): void {
    if (props.name !== undefined) this.updateName(props.name);
    if (props.email !== undefined) this.updateEmail(props.email);
    if (props.password !== undefined) this.updatePassword(props.password);
    if (props.role !== undefined) this.updateRole(props.role);
  }
}
