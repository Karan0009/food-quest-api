import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import {
  GenerateRefreshTokenDto,
  GenerateTokenDto,
} from './dto/generate-token.dto';
import RefreshToken from 'src/models/refresh-tokens.model';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class JwtService {
  constructor(
    private readonly config: ConfigService,
    private readonly utils: UtilsService,
  ) {}

  async generateRefreshToken(data: GenerateRefreshTokenDto): Promise<string> {
    try {
      const secretKey = this.config.get('REFRESH_TOKEN_SECRET_KEY');
      if (!secretKey) throw new Error('Secret key not found');
      const token = jwt.sign(data.payload, secretKey, {
        expiresIn: '30d',
        subject: data.userId ?? undefined,
      });
      const refreshToken = await RefreshToken.create({
        token: token,
        expire_at: this.utils
          .getDayJsObj()
          .tz('utc')
          .add(30, 'd')
          .format('YYYY-MM-DD HH:mm:ss Z'),
        meta: data.meta,
      });
      return refreshToken.id;
    } catch (err) {
      throw err;
    }
  }

  async generateAccessToken(data: GenerateTokenDto): Promise<string | null> {
    try {
      const secretKey = this.config.get('ACCESS_TOKEN_SECRET_KEY');
      if (!secretKey) throw new Error('Secret key not found');
      return jwt.sign(data.payload, secretKey, {
        expiresIn: data?.expiresIn || '30d',
        subject: data.userId ?? undefined,
      });
    } catch (err) {
      return null;
    }
  }

  async verifyAccessToken(
    token: string,
  ): Promise<string | jwt.JwtPayload | null> {
    try {
      const secretKey = this.config.get('ACCESS_TOKEN_SECRET_KEY');
      if (!secretKey) throw new Error('Secret key not found');
      const decodedToken = jwt.verify(token, secretKey);
      return decodedToken;
    } catch (err) {
      return null;
    }
  }
}
