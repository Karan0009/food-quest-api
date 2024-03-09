import { Controller } from '@nestjs/common';
import { BaseController } from 'src/core/base/base.controller';
import { User } from 'src/models/user.model';
import { UserService } from './user.service';
// extends BaseController<User>
@Controller('user')
export class UserController extends BaseController<User> {
  constructor(protected readonly userService: UserService) {
    super(userService);
  }
}
