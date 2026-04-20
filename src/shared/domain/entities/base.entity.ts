import { Replace } from '@shared/domain/helpers/replace.helper';
import { randomUUID } from 'crypto';
import { UpdatedAtException } from './exceptions/updatedAt.exception';
import { Id } from '../value-objects/id.vo';

interface BaseEntityProps {
  id: Id;
  createdAt: Date;
  updatedAt: Date;
}

type BaseEntityInput = Replace<
  BaseEntityProps,
  {
    id?: Id;
    createdAt?: Date;
    updatedAt?: Date;
  }
>;

export abstract class BaseEntity {
  protected props: BaseEntityProps;

  constructor(props: BaseEntityInput) {
    const now = new Date();

    const createdAt = props.createdAt ?? now;
    const updatedAt = props.updatedAt ?? createdAt;

    this.props = {
      id: props.id ?? Id.create(randomUUID()),
      createdAt,
      updatedAt,
    };

    if (updatedAt < createdAt) {
      throw new UpdatedAtException();
    }
  }

  public get id(): Id {
    return this.props.id;
  }

  public get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return new Date(this.props.updatedAt);
  }

  protected touch(): void {
    this.props.updatedAt = new Date();
  }
}
