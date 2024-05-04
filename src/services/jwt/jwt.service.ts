import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { GenerateTokenDto } from './dto/generate-token.dto';

@Injectable()
export class JwtService {
  constructor(private readonly config: ConfigService) {}

  async generateToken(data: GenerateTokenDto): Promise<string | null> {
    try {
      const secretKey = this.config.get('JWT_SECRET_KEY');
      if (!secretKey) throw new Error('Secret key not found');
      return jwt.sign(data.payload, secretKey, {
        expiresIn: data.expiresIn,
      });
    } catch (err) {
      return null;
    }
  }

  async verifyToken(token: string): Promise<string | jwt.JwtPayload | null> {
    try {
      const secretKey = this.config.get('JWT_SECRET_KEY');
      if (!secretKey) throw new Error('Secret key not found');
      const decodedToken = jwt.verify(token, secretKey);
      return decodedToken;
    } catch (err) {
      return null;
    }
  }
}
