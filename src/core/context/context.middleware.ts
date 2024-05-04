import { Injectable, NestMiddleware } from '@nestjs/common';
import { getNamespace } from 'cls-hooked';
import { Request } from 'express';
import { defaultConfig } from 'src/config/env';
import { v1 as uuidv1 } from 'uuid';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    req.requestId = uuidv1();
    const reqContext = getNamespace(`${defaultConfig.APP_NAME}-req-context`);
    reqContext.run(() => {
      const value = req.user
        ? {
            user: req.user,
            request_id: req.requestId,
            url: req.path,
          }
        : { request_id: req.requestId, url: req.path };
      reqContext.set('req-context', value);
      next();
    });
  }
}
