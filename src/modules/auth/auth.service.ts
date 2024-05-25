import { Injectable } from '@nestjs/common';
import Otp from 'src/models/otp.model';
import { UtilsService } from 'src/services/utils/utils.service';

@Injectable()
export class AuthService {
  constructor(private util: UtilsService) {}
  async createNewOtp() {
    try {
      const newOtp = await Otp.create({
        otp: this.util.generateRandomOtp({ length: 6, onlyNumbers: true }),
      });
      return newOtp;
    } catch (err) {
      throw err;
    }
  }
}
