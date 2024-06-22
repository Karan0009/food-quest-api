import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_ENDPOINT, SUSPENDED_ENDPOINT } from 'src/core/constants';
import { JwtService } from 'src/services/jwt/jwt.service';
import { UtilsService } from 'src/services/utils/utils.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
    private readonly util: UtilsService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isSuspended(context)) return false;

    if (this.isPublic(context)) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const accessToken = request.cookies['access-token'];
    if (!accessToken) {
      return false;
    }
    const decodedAccessToken = this.util.decodeFromBase64(accessToken);
    if (!decodedAccessToken) {
      return false;
    }

    if (!decodedAccessToken.startsWith('Bearer ')) {
      return false;
    }

    const token = decodedAccessToken.split(' ')[1];
    try {
      const decoded = await this.jwt.verifyAccessToken(token);
      if (!decoded) return false;
      request.user = decoded;
      return true;
    } catch (error) {
      return false;
    }
  }

  private isSuspended(context: ExecutionContext): boolean {
    const isSuspended = this.reflector.getAllAndOverride(SUSPENDED_ENDPOINT, [
      context.getHandler(),
      context.getClass,
    ]);
    if (isSuspended) return true;
    return false;
  }

  private isPublic(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get(
      IS_PUBLIC_ENDPOINT,
      context.getHandler(),
    );

    return isPublic;
  }
}
