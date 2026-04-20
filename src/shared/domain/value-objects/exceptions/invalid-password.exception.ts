import { DomainError } from '@shared/domain/exceptions/domain-error.exception';

export class InvalidPasswordException extends DomainError {
  constructor() {
    super(
      'A senha deve conter no mínimo 8 caracteres, com pelo menos 1 letra minúscula, 1 letra maiúscula, 1 número, 1 caractere especial e sem espaços.',
    );
  }
}
