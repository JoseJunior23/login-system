import { DomainError } from '@shared/domain/exceptions/domain-error.exception';

export class UserUnauthorizedException extends DomainError {
  constructor() {
    super('Email ou senha incorretos');
  }
}
