import { DomainError } from '@shared/domain/exceptions/domain-error.exception';

export class InvalidUserIdException extends DomainError {
  constructor() {
    super('Identificador de Usuário invalido');
  }
}
