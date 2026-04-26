import { DomainError } from '@shared/domain/exceptions/domain-error.exception';

export class UserPasswordRequiredException extends DomainError {
  constructor() {
    super('Uma senha precisa ser passada');
  }
}
