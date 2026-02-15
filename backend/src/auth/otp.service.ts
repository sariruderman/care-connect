import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OtpService {
  constructor(private readonly prisma: PrismaService) {}

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async saveOtp(phone: string, code: string) {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await this.prisma.otpVerification.create({
      data: {
        phone,
        code,
        expiresAt,
      },
    });
  }

  async sendOtp(phone: string, code: string) {
    // כאן יש לחבר לספק SMS (Twilio וכו')
    // דוגמה: await smsProvider.send(phone, `קוד האימות שלך: ${code}`)
    console.log(`Sending OTP ${code} to ${phone}`);
  }

  async verifyOtp(phone: string, code: string): Promise<boolean> {
    const otp = await this.prisma.otpVerification.findFirst({
      where: {
        phone,
        code,
        verified: false,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!otp) return false;

    await this.prisma.otpVerification.update({
      where: { id: otp.id },
      data: { verified: true },
    });

    return true;
  }
}
