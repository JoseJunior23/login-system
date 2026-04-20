import { HttpStatus } from '@nestjs/common';
import { AppExceptionProps, AppException } from './app.exception';

interface IncorrectValuesExceptionsProps {
  fields: AppExceptionProps['fields'];
}
export class IncorrectValuesException extends AppException {
  constructor({ fields }: IncorrectValuesExceptionsProps) {
    super({
      message: 'Dados Inválidos',
      status: HttpStatus.BAD_REQUEST,
      fields,
    });
  }
}
