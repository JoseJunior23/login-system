import { DomainError } from '@shared/domain/exceptions/domain-error.exception';

export class RemoveRoleException extends DomainError {
  constructor() {
    super('Permissão não pode ser retirada');
  }
}
