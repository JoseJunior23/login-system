import { InvalidEmailException } from './exceptions/invalid-email.exception';

export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  private static isValid(value: string): boolean {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return emailRegex.test(value);
  }

  static create(value: string): Email {
    const normalizedValue = value.trim().toLowerCase();
    if (!Email.isValid(normalizedValue)) {
      throw new InvalidEmailException();
    }
    return new Email(normalizedValue);
  }
  get value(): string {
    return this._value;
  }

  equals(other?: Email): boolean {
    return !!other && this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
