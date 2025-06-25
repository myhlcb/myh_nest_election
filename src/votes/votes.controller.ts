import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import Redlock from 'redlock';
import { RolesGuard } from '../common/guards/role.guard';
import { Role } from '../common/decorators/role.decorator';
import { VotesService } from './votes.service';
import { VoteDto } from './dto/vote.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
@ApiTags('选举')
@Controller('votes')
@UseGuards(AuthGuard('my_jwt'), RolesGuard) // 👈 应用 JWT 守卫
@Role('voter') // 👈 仅限投票人角色访问
export class VotesController {
  constructor(
    private readonly votesService: VotesService,
    @Inject('REDLOCK')
    private readonly redlock: Redlock,
  ) {}

  @Post()
  @ApiOperation({ summary: '输入候选人id选举' })
  @ApiBody({ type: VoteDto })
  async vote(@Body() dto: VoteDto, @Request() req) {
    const user = req.user as { userId: number; role: string };
    const voterId = user.userId;
    const LOCK_KEY = `lock:vote:${voterId}`;
    try {
      await this.redlock.acquire([LOCK_KEY], 5000);
    } catch (error) {
      throw new ConflictException('系统忙，请稍后再试');
    }
    return this.votesService.vote(voterId, dto.candidateId);
  }
}
