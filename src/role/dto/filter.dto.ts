import { IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterDto {
  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  page: number = 1;

  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  limit: number = 10;

  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  sort: string = 'ASC';

  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  id: number;

  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })  
  name: number;
}
