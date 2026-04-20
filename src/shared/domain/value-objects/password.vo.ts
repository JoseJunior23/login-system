import { InvalidPasswordException } from './exceptions/invalid-password.exception';

export class Password {
  private readonly _value: string;
  private constructor(value: string) {
    this._value = value;
  }

  private static isValid(value: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(value);
  }

  static create(value: string): Password {
    if (!Password.isValid(value)) {
      throw new InvalidPasswordException();
    }
    return new Password(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other?: Password): boolean {
    return !!other && this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
