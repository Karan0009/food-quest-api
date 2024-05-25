import { Injectable } from '@nestjs/common';
import Otp from 'src/models/otp.model';

@Injectable()
export class AuthService {
  async createNewOtp() {
    try {
      const newOtp = await Otp.create({});
      return newOtp;
    } catch (err) {
      throw err;
    }
  }
}
