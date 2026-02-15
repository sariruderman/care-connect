import { Module } from '@nestjs/common';
import { BabysittersController } from './babysitters.controller';
import { BabysittersService } from './babysitters.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BabysittersController],
  providers: [BabysittersService],
  exports: [BabysittersService],
})
export class BabysittersModule {}
