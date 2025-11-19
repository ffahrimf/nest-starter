import { IsNotEmpty, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSuperadminDto {
  @ApiProperty({ type: Number })
  user_id!: number;

  @ApiProperty({ type: String, description: 'This is a required property' })
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username hanya boleh menggunakan huruf, angka, dan simbol _',
  })
  @MinLength(8)
  username!: string;

  @ApiProperty({ type: String, description: 'This is a required property' })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ type: String, description: 'This is a required property' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ type: String, description: 'This is a required property' })
  @IsNotEmpty()
  phone_number!: string;

  @ApiProperty({ type: Date, description: 'This is a required property' })
  @IsNotEmpty()
  birth_date!: Date;

  @ApiProperty({ type: String, description: 'This is a required property' })
  @IsNotEmpty()
  gender!: string;

  @ApiProperty({ type: String, description: 'This is a required property' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Password harus mengandung minimal satu huruf besar, satu huruf kecil, dan satu angka.',
  })
  @MinLength(8, { message: 'Password harus minimal 8 karakter.' })
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ type: Boolean, description: 'This is a required property' })
  @IsNotEmpty()
  status: boolean;

  @ApiProperty({ type: String })
  photo?: Express.Multer.File;
}
