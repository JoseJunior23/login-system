import { randomUUID } from 'crypto';
import { InvalidIdException } from '../entities/exceptions/invalid-id.exception';

export class Id {
  private readonly _value: string;

  private static isValid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }

  private constructor(value: string) {
    if (!Id.isValid(value)) {
      throw new InvalidIdException();
    }

    this._value = value;
  }

  static create(value?: string): Id {
    return new Id(value ?? randomUUID());
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  equals(other: Id): boolean {
    return this._value === other._value;
  }
}
