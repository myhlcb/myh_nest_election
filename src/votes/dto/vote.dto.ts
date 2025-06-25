import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VoteDto {
  @ApiProperty({
    example: 1,
    description: '候选人id',
  })
  @IsNumber()
  candidateId: number;
}
