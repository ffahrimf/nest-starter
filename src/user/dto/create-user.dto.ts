import { IsNotEmpty, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username hanya boleh menggunakan huruf, angka, dan simbol "_"',
  })
  @MinLength(8)
  username!: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'Email tidak valid. Contoh: budi@gmail.com',
  })
  email!: string;

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

  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  role_id!: number;
}
