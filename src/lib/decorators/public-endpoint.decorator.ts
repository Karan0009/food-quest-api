import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_ENDPOINT } from 'src/core/constants';

export const PublicEndpoint = (): CustomDecorator<typeof IS_PUBLIC_ENDPOINT> =>
  SetMetadata(IS_PUBLIC_ENDPOINT, true);
