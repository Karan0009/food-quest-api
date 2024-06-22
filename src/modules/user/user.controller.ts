import { Controller, Get, HttpStatus, Param, Patch, Req } from '@nestjs/common';
import { BaseController } from 'src/core/base/base.controller';
import { UserService } from './user.service';
import User from 'src/models/user.model';
import { Request } from 'express';
import { CachingService } from 'src/services/caching/caching.service';
import BaseEntity from 'src/core/base/base.entity';
// extends BaseController<User>
@Controller('v1/users')
export class UserController extends BaseController<User> {
  constructor(
    protected readonly userService: UserService,
    private readonly cachingService: CachingService,
  ) {
    super(userService);
  }

  // @Get('/users')
  // async getUsers(@Res() res: Response) {
  //   this.cachingService.set('users', 'asdfasd');
  //   const users = await this.userService.find();
  //   return res.json({ users });
  // }

  @Get(':id')
  async updateUser(@Param() params, @Req() req: Request) {
    try {
      req.res.statusCode = HttpStatus.CREATED;

      return new BaseEntity({
        data: params,
        error: null,
        message: 'updated user successfully',
        statusCode: HttpStatus.CREATED,
      });
    } catch (err) {
      throw err;
    }
  }
}
