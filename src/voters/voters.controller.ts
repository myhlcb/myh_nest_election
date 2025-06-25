import {
  Body,
  Query,
  Controller,
  UseGuards,
  Post,
  Get,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/role.guard';
import { Role } from '../common/decorators/role.decorator';
import { VotersService } from './voters.service';
import { RegisterVoterDto } from './dto/register-voter.dto';
import { VerifyVoterDto } from './dto/verify-voter.dto';

import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
@ApiTags('选民注册')
@Controller('voters')
export class VotersController {
  constructor(private readonly votersService: VotersService) {}

  // 注册
  @Post('register')
  @ApiOperation({ summary: 'SSN 登录，返回 JWT token' })
  @ApiBody({ type: RegisterVoterDto })
  async register(@Body() dto: RegisterVoterDto) {
    return this.votersService.register(dto.name, dto.ssn);
  }
  // 验证身份
  @UseGuards(AuthGuard('my_jwt'), RolesGuard) // 👈 应用 JWT 守卫
  @Role('voter')
  @Post('verify')
  @ApiOperation({ summary: '输入SSN,验证选民身份' })
  @ApiBody({ type: VerifyVoterDto })
  async verify(@Body() dto: { ssn: string }, @Request() req) {
    const user = req.user as { userId: number; role: string; ssn: string };
    if (user.ssn !== dto.ssn) {
      throw new Error('身份验证失败，SSN 不匹配');
    }
    return this.votersService.verify(dto.ssn);
  }
  //查看信息
  @UseGuards(AuthGuard('my_jwt'), RolesGuard) // 👈 应用 JWT 守卫
  @Role('voter')
  @Get('info')
  async info(@Request() req) {
    const user = req.user as { userId: number; role: string; ssn: string };
    const ssn = user.ssn;
    return this.votersService.findBySSN(ssn);
  }
}
