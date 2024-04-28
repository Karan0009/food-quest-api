import { Controller, Get, Res } from '@nestjs/common';
import { BaseController } from 'src/core/base/base.controller';
import { UserService } from './user.service';
import User from 'src/models/user.model';
import { Response } from 'express';
// extends BaseController<User>
@Controller('user')
export class UserController extends BaseController<User> {
  constructor(protected readonly userService: UserService) {
    super(userService);
  }

  @Get('/users')
  async getUsers(@Res() res: Response) {
    const users = await this.userService.find();
    return res.json({ users });
  }
}
