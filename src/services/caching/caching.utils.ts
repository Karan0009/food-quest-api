import { Injectable } from '@nestjs/common';
import { CachingService } from './caching.service';
import { ConstantsService } from '../constants/constants.service';

/**
 * * PATTERNS
 * * RESOURCE:<RESOURCE_ID> => for resource cache
 * * ENTITY_ONE:<ENTITY_ONE_ID>:PURPOSE => for mapping cache
 *
 * ? PURPOSES CAN BE FOUND IN CONSTANTS SERVICE
 * ? RESOURCES CAN BE FOUND IN CONSTANTS SERVICE
 */

@Injectable()
export class CachingUtils {
  constructor(
    private readonly cachingService: CachingService,
    private readonly constants: ConstantsService,
  ) {}
}
