import { Inject, Injectable } from '@nestjs/common';
import {
  Attributes,
  DestroyOptions,
  FindOptions,
  QueryOptions,
  QueryOptionsWithType,
  QueryTypes,
  UpdateOptions,
  UpsertOptions,
} from 'sequelize';
import { Model, Repository, Sequelize } from 'sequelize-typescript';
import { MakeNullishOptional } from 'sequelize/types/utils';
import { CONNECTION } from '../constants';

@Injectable()
export abstract class BaseService<T extends Model> {
  @Inject(CONNECTION)
  protected readonly connection: Sequelize;
  //   @Inject(ErrorsService)
  //   protected readonly errorsService: ErrorsService;

  private _repository: Repository<T>;

  constructor(protected readonly model: new () => T) {}

  get repository(): Repository<T> {
    if (!this._repository) {
      this._repository = this.connection.getRepository(this.model);
    }
    return this._repository;
  }

  async create(
    data:
      | MakeNullishOptional<T['_creationAttributes']>
      | MakeNullishOptional<T['_creationAttributes']>[],
  ): Promise<T | T[]> {
    if (Array.isArray(data)) {
      return this.repository.bulkCreate(data);
    } else {
      return this.repository.create(data);
    }
  }

  async upsert(
    data: MakeNullishOptional<T['_creationAttributes']>,
    options?: UpsertOptions<Attributes<T>>,
  ): Promise<[model: T, created: boolean | null]> {
    return this.repository.upsert(data, options);
  }

  async find(options?: FindOptions<Attributes<T>>): Promise<T[]> {
    return this.repository.findAll(options);
  }

  async findOne(options?: FindOptions<Attributes<T>>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  async findById(
    id: number,
    options?: Omit<FindOptions<Attributes<T>>, 'where'>,
  ): Promise<T | null> {
    return this.repository.findByPk(id, options);
  }

  async update(
    data: { [key in keyof Attributes<T>]: Attributes<T>[key] },
    options: Omit<UpdateOptions<Attributes<T>>, 'returning'>,
  ): Promise<[affectedCount: number, affectedRows: T[]]> {
    return this.repository.update(data, { ...options, returning: true });
  }

  async delete(
    options: DestroyOptions<Attributes<T>>,
    model?: T,
  ): Promise<void> {
    if (!model) await this.repository.destroy(options);
    else await model.destroy(options);
  }

  async rawQuery(
    sql:
      | string
      | {
          query: string;
          values: unknown[];
        },
    options?: QueryOptions | QueryOptionsWithType<QueryTypes.RAW> | undefined,
  ): Promise<[unknown[], unknown]> {
    return this.connection.query(sql, options);
  }
}
