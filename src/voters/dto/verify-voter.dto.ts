import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyVoterDto {
  @ApiProperty({ example: '123-45-6789', description: '要验证的 SSN' })
  @IsString()
  ssn: string;
}
