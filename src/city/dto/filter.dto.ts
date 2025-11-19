import { IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterDto {
  @ApiProperty({ type: Number, description: 'This is a required property' })
  @IsOptional()
  page: number = 1;

  @ApiProperty({ type: Number, description: 'This is a required property' })
  @IsOptional()
  limit: number = 10;

  @ApiProperty({ type: String, description: 'This is a required property' })
  @IsOptional()
  sort: string = 'ASC';

  @ApiProperty({ type: Number, description: 'This is a required property' })
  @IsOptional()
  id: number;

  @ApiProperty({ type: Number, description: 'This is a required property' })
  @IsOptional()
  province_id: number;

  @ApiProperty({ type: String, description: 'This is a required property' })
  @IsOptional()
  name: string;
}
