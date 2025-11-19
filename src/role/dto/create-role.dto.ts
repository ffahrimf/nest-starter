import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  name!: string;
}
