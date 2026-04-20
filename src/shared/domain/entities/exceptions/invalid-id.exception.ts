import { DomainError } from '@shared/domain/exceptions/domain-error.exception';

export class InvalidIdException extends DomainError {
  constructor() {
    super('Id é obrigatório');
  }
}
