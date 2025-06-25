import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voter } from './voter.entity';
import { VotersService } from './voters.service';
import { VotersController } from './voters.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Voter])],
  controllers: [VotersController],
  providers: [VotersService],
  exports: [VotersService],
})
export class VotersModule {}
