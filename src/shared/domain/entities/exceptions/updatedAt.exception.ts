import { DomainError } from '@shared/domain/exceptions/domain-error.exception';

export class UpdatedAtException extends DomainError {
  constructor() {
    super('Date de atualização deve ser maior que data de criação');
  }
}
