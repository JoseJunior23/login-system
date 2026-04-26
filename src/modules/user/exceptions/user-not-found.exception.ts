import { DomainError } from '@shared/domain/exceptions/domain-error.exception';

export class UserNotFoundException extends DomainError {
  constructor() {
    super('Usuário não encontrado.');
  }
}
