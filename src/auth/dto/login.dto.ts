import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ type: String, description: 'This is a required property' })
  @IsNotEmpty()
  key!: string;

  @ApiProperty({ type: String, description: 'This is a required property' })
  @IsNotEmpty()
  password!: string;
}
