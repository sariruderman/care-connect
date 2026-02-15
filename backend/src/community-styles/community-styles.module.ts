import { Module } from '@nestjs/common';
import { CommunityStylesController } from './community-styles.controller';
import { CommunityStylesService } from './community-styles.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CommunityStylesController],
  providers: [CommunityStylesService],
  exports: [CommunityStylesService],
})
export class CommunityStylesModule {}
