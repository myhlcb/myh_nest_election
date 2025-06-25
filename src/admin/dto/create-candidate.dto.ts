import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCandidateDto {
  @ApiProperty({
    example: '特朗普',
    description: '候选人名字',
  })
  @IsString()
  name: string;
}
