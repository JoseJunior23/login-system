import { describe, expect, it } from 'vitest';
import { InvalidIdException } from './exceptions/invalid-id.exception';
import { Id } from './id.vo';

describe('Id', () => {
  it('should create a valid id from a provided uuid', () => {
    const value = '550e8400-e29b-41d4-a716-446655440000';

    const id = Id.create(value);

    expect(id.value).toBe(value);
    expect(id.toString()).toBe(value);
  });

  it('should create a new valid uuid when value is not provided', () => {
    const id = Id.create();

    expect(id.value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('should throw when id is invalid', () => {
    expect(() => Id.create('invalid-id')).toThrow(InvalidIdException);
  });

  it('should compare equal ids correctly', () => {
    const value = '550e8400-e29b-41d4-a716-446655440000';
    const firstId = Id.create(value);
    const secondId = Id.create(value);

    expect(firstId.equals(secondId)).toBe(true);
  });

  it('should compare different ids correctly', () => {
    const firstId = Id.create('550e8400-e29b-41d4-a716-446655440000');
    const secondId = Id.create('550e8400-e29b-41d4-a716-446655440001');

    expect(firstId.equals(secondId)).toBe(false);
  });
});
