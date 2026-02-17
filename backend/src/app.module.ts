import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { GuardiansModule } from './guardians/guardians.module';
import { BabysittersModule } from './babysitters/babysitters.module';
import { ParentsModule } from './parents/parents.module';
import { CommunityStylesModule } from './community-styles/community-styles.module';
import { CityModule } from './city/city.module';
import { JobsModule } from './jobs/jobs.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ParentsModule,
    BabysittersModule,
    GuardiansModule,
    CommunityStylesModule,
    CityModule,
    JobsModule,
    BookingsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
