import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {
  @ApiProperty({ example: '123-45-6789', description: '选民 SSN（身份证号）' })
  @IsString()
  ssn: string;
}
