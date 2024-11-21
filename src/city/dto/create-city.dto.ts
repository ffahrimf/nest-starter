import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCityDto {
  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  province_id!: number;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  name!: string;
}
