import { DomainError } from '@shared/domain/exceptions/domain-error.exception';

export class UserConflictException extends DomainError {
  constructor() {
    super('Há um usuário registrado com este email.');
  }
}
