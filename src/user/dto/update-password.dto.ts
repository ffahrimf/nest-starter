import { IsNotEmpty, Matches,MinLength } from 'class-validator';
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
        'Password must be consist of at least, 1 lowercase, 1 uppercase letter or underscore',
    })
    @MinLength(8)
    @IsNotEmpty()
    password!: string;
}