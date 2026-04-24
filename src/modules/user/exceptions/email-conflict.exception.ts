import { DomainError } from '@shared/domain/exceptions/domain-error.exception';

export class EmailConflictException extends DomainError {
  constructor() {
    super('Existe um usuário cadastrado com este email');
  }
}
