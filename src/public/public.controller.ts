import { Controller, Get } from '@nestjs/common';
import { PublicService } from './public.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('选举结果')
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('live-results')
  async liveResults() {
    return this.publicService.getLiveResults();
  }
}
