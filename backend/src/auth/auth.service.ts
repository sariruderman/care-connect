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

//   async verifyOtp(phone: string, code: string) {
//     const valid = await this.otpService.verifyOtp(phone, code);
//     if (!valid) throw new UnauthorizedException('Invalid or expired OTP');
    
//     // let user = await this.prisma.user.findUnique({ 
//     //   where: { phone },
//     //   include: { roles: true }
//     // });
//     let user = await this.prisma.user.findUnique({ 
//   where: { phone },
//   select: {
//     id: true,
//     phone: true,
//     email: true,
//     status: true,
//     isVerified: true,
//     roles: {
//       select: {
//         role: true
//       }
//     }
//   }
// });
    
//     if (!user) {
//       throw new UnauthorizedException('User not found. Please register.');
//     }
    
//     // const roles = user.roles.map(r => r.role);
//     const roles = user.roles.map(r => r.role);
//     const token = this.jwtService.sign({ userId: user.id, roles });
    
//     return { success: true, data: { token, user } };
//   }
async verifyOtp(phone: string, code: string) {
  const valid = await this.otpService.verifyOtp(phone, code);
  if (!valid) throw new UnauthorizedException('Invalid or expired OTP');
  
  let user = await this.prisma.user.findUnique({ 
    where: { phone }
  });
  
  // if (!user) {
  //   throw new UnauthorizedException('User not found. Please register.');
  // }
//    const userRoles = await this.prisma.userRole.findMany({
//     where: { userId: user.id },
//     select: { role: true }
//   });
  
//   const roles = userRoles.map(r => r.role);
//   const token = this.jwtService.sign({ userId: user.id, roles });
  
//   return { success: true, data: { token, user } };
// }
  
   if (!user) {
    const trialEndsAt = new Date();
    trialEndsAt.setMonth(trialEndsAt.getMonth() + 1); // 30 days free trial
    
    user = await this.prisma.user.create({
      data: {
        phone,
        isVerified: true,
        trialEndsAt,
      },
    });
  }
  
  const userRoles = await this.prisma.userRole.findMany({
    where: { userId: user.id },
    select: { role: true }
  });
  
  const roles = userRoles.map(r => r.role);
  const token = this.jwtService.sign({ userId: user.id, roles });
  
  return { success: true, data: { token, user: { ...user, roles } } };
}

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const userRoles = await this.prisma.userRole.findMany({
      where: { userId: user.id },
      select: { role: true },
    });

    const roles = userRoles.map((r) => r.role);

    return { success: true, data: { ...user, roles } };
  }
}
