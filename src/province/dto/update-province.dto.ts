import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateProvinceDto } from './create-province.dto';

export class UpdateProvinceDto extends PartialType(CreateProvinceDto) {
  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  id!: number;
}
