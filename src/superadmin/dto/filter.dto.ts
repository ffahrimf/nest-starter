import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FilterDto {
  @ApiProperty({ type: Number })
  @IsOptional()
  page: number = 1;

  @ApiProperty({ type: Number })
  @IsOptional()
  limit: number = 10;

  @ApiProperty({ type: String })
  @IsOptional()
  sort: string = 'ASC';

  @ApiProperty({ type: String })
  @IsOptional()
  uuid!: string;

  @ApiProperty({ type: String })
  @IsOptional()
  name!: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  user_id!: number;

  @ApiProperty({ type: String })
  @IsOptional()
  status!: string;
}
