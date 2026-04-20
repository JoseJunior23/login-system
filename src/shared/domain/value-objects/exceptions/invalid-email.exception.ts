import { DomainError } from '@shared/domain/exceptions/domain-error.exception';

export class InvalidEmailException extends DomainError {
  constructor() {
    super('Formato do email invalido !!!');
  }
}
