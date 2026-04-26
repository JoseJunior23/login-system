import { DomainError } from '@shared/domain/exceptions/domain-error.exception';

export class UserPasswordNotMatchException extends DomainError {
  constructor() {
    super('As senhas não conferem.');
  }
}
