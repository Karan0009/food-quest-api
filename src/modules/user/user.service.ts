import { Global, Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base.service';
import User from 'src/models/user.model';
// extends BaseService<User>
@Global()
@Injectable()
export class UserService extends BaseService<User> {
  constructor() {
    super(User);
  }
}
