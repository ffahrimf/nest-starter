import { IsNotEmpty, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  id!: number;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Password harus mengandung minimal satu huruf besar, satu huruf kecil, dan satu angka.',
  })
  @MinLength(8, {
    message: 'Password harus minimal 8 karakter.',
  })
  @IsNotEmpty()
  password!: string;
}
