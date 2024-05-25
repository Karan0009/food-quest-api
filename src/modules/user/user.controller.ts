import { Controller, Get, Res } from '@nestjs/common';
import { BaseController } from 'src/core/base/base.controller';
import { UserService } from './user.service';
import User from 'src/models/user.model';
import { Response } from 'express';
import { CachingService } from 'src/services/caching/caching.service';
// extends BaseController<User>
@Controller('user')
export class UserController extends BaseController<User> {
  constructor(
    protected readonly userService: UserService,
    private readonly cachingService: CachingService,
  ) {
    super(userService);
  }

  @Get('/users')
  async getUsers(@Res() res: Response) {
    this.cachingService.set('users', 'asdfasd');
    const users = await this.userService.find();
    return res.json({ users });
  }
}
