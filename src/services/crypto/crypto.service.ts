import { Global, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { GenerateHashDto } from './dto/generate-hash.dto';

@Global()
@Injectable()
export class CryptoService {
  async generateHash(data: GenerateHashDto): Promise<string> {
    try {
      const saltRounds = data.saltRounds || 10;
      const hashedPassword = await bcrypt.hash(data.stringToHash, saltRounds);
      return hashedPassword;
    } catch (err) {
      return '';
    }
  }

  async compareHash(plainStr: string, hash: string): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(plainStr, hash);
      if (isMatch) return true;
      return false;
    } catch (err) {
      return false;
    }
  }
}
