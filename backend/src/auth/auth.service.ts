import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  async sendOtp(phone: string) {
    const code = this.otpService.generateOtp();
    await this.otpService.saveOtp(phone, code);
    await this.otpService.sendOtp(phone, code);
    return { success: true, data: { expires_in: 300 } };
  }

  async verifyOtp(phone: string, code: string) {
    const valid = await this.otpService.verifyOtp(phone, code);
    if (!valid) throw new UnauthorizedException('Invalid or expired OTP');
    
    let user = await this.prisma.user.findUnique({ 
      where: { phone },
      include: { roles: true }
    });
    
    if (!user) {
      throw new UnauthorizedException('User not found. Please register.');
    }
    
    const roles = user.roles.map(r => r.role);
    const token = this.jwtService.sign({ userId: user.id, roles });
    
    return { success: true, data: { token, user } };
  }
}
