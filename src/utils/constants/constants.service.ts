import { Injectable } from '@nestjs/common';

@Injectable()
export class ConstantsService {
  USER_STATUS = { active: 'active', inactive: 'inactive', deleted: 'deleted' };
}
