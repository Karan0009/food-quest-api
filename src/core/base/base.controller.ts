import {
  Body,
  Controller,
  Delete,
  Get,
  Global,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Model } from 'sequelize-typescript';
import { DestroyOptions, UpdateOptions } from 'sequelize';
import { MakeNullishOptional } from 'sequelize/types/utils';
import { BaseService } from './base.service';
import BaseEntity from './base.entity';

@Global()
@Controller()
export class BaseController<T extends Model> {
  constructor(protected readonly service: BaseService<T>) {}

  // T | T[]
  @Post()
  async createEntity(
    @Body() data: MakeNullishOptional<T> | MakeNullishOptional<T>[],
  ): Promise<BaseEntity> {
    const entity = await this.service.create(data);
    return new BaseEntity({
      data: entity,
      error: null,
      message: 'upserted successfully',
      statusCode: HttpStatus.CREATED,
    });
  }

  // { row: T; created: boolean | null }
  @Put()
  async upsertEntity(
    @Body()
    body: {
      data: MakeNullishOptional<T>;
      options: UpdateOptions<T>;
    },
  ): Promise<BaseEntity> {
    const entity = await this.service.upsert(body.data, body.options);
    return new BaseEntity({
      data: {
        row: entity[0],
        created: entity[1],
      },
      error: null,
      message: 'upserted successfully',
      statusCode: HttpStatus.CREATED,
    });
  }

  @Get()
  async getAllEntities(): Promise<BaseEntity> {
    const entities = await this.service.find({ raw: true });
    return new BaseEntity({
      data: entities,
      error: null,
      message: 'fetched successfully',
      statusCode: HttpStatus.OK,
    });
  }

  @Get(':id')
  async getEntity(@Param('id') id: number): Promise<BaseEntity> {
    const entity = await this.service.findById(id, { raw: true });
    if (!entity) {
      throw new Error('Requested resource not found.');
      //   this.errorsService.dataNotFound('Requested resource not found.');
    }
    return new BaseEntity({
      data: entity,
      error: null,
      message: 'fetched successfully',
      statusCode: HttpStatus.OK,
    });
  }
  // : Promise<{ affectedCount: number; affectedRows: T[] }>
  // @Patch()
  async updateEntity(
    @Body()
    body: {
      data: MakeNullishOptional<T>;
      options: UpdateOptions<T>;
    },
  ) {
    const entity = await this.service.update(body.data, body.options);
    return new BaseEntity({
      data: {
        affectedCount: entity[0],
        affectedRows: entity[1],
      },
      error: null,
      message: 'updated successfully',
      statusCode: HttpStatus.OK,
    });
  }

  @Delete()
  async deleteEntity(
    @Body()
    options: DestroyOptions<T>,
  ): Promise<BaseEntity> {
    await this.service.delete(options);
    return new BaseEntity({
      data: { message: 'Deleted successfully' },
      error: null,
      message: 'deleted successfully',
      statusCode: HttpStatus.OK,
    });
  }
}
