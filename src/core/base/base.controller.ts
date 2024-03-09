import {
  Body,
  Controller,
  Delete,
  Get,
  Global,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { Model } from 'sequelize-typescript';
import { DestroyOptions, UpdateOptions } from 'sequelize';
import { MakeNullishOptional } from 'sequelize/types/utils';
import { BaseService } from './base.service';

@Global()
@Controller()
export class BaseController<T extends Model> {
  constructor(protected readonly service: BaseService<T>) {}

  @Post()
  async createEntity(
    @Body() data: MakeNullishOptional<T> | MakeNullishOptional<T>[],
  ): Promise<T | T[]> {
    const entity = await this.service.create(data);
    return entity;
  }

  @Put()
  async upsertEntity(
    @Body()
    body: {
      data: MakeNullishOptional<T>;
      options: UpdateOptions<T>;
    },
  ): Promise<{ row: T; created: boolean | null }> {
    const entity = await this.service.upsert(body.data, body.options);
    return {
      row: entity[0],
      created: entity[1],
    };
  }

  @Get()
  async getAllEntities(): Promise<T[]> {
    const entities = await this.service.find();
    return entities;
  }

  @Get(':id')
  async getEntity(@Param('id') id: number): Promise<T> {
    const entity = await this.service.findById(id);
    if (!entity) {
      throw new Error('Requested resource not found.');
      //   this.errorsService.dataNotFound('Requested resource not found.');
    }
    return entity;
  }

  @Patch()
  async updateEntity(
    @Body()
    body: {
      data: MakeNullishOptional<T>;
      options: UpdateOptions<T>;
    },
  ): Promise<{ affectedCount: number; affectedRows: T[] }> {
    const entity = await this.service.update(body.data, body.options);
    return {
      affectedCount: entity[0],
      affectedRows: entity[1],
    };
  }

  @Delete()
  async deleteEntity(
    @Body()
    options: DestroyOptions<T>,
  ): Promise<{ message: string }> {
    await this.service.delete(options);
    return { message: 'Deleted successfully' };
  }
}
