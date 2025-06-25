import { Body, Controller, UseGuards, Get, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/role.guard';
import { Role } from '../common/decorators/role.decorator';
import { AdminService } from './admin.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
@ApiTags('Admin')
@Controller('admin')
@UseGuards(AuthGuard('my_jwt'), RolesGuard) // 👈 应用 JWT 守卫
@Role('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Post('candidates')
  @ApiOperation({ summary: '输入候选人名字' })
  @ApiBody({ type: CreateCandidateDto })
  async addCandidate(@Body() dto: CreateCandidateDto) {
    return this.adminService.addCandidate(dto.name);
  }

  @Post('start')
  async start() {
    return this.adminService.startElection();
  }

  @Post('stop')
  async stop() {
    return this.adminService.stopElection();
  }

  @Get('results')
  async results() {
    return this.adminService.getResults();
  }
}
