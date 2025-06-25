import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterVoterDto {
  @ApiProperty({
    example: 'Green',
    description: '选民名字',
  })
  @IsString()
  name: string;
  @ApiProperty({
    example: '123-45-6789',
    description: '选民SSN（身份证号）',
  })
  @IsString()
  ssn: string;
}
