import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateSuperadminDto } from './create-superadmin.dto';

export class UpdateSuperadminDto extends PartialType(CreateSuperadminDto) {
  @ApiProperty({ type: Number, description: 'This is a required property' })
  @IsNotEmpty()
  id!: number;
}
