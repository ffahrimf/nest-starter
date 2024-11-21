import { Controller,Post,Body,UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'src/helper/response';
import { ApiTags } from '@nestjs/swagger';
import { GlobalExceptionFilter } from 'src/global-exception.filter';
import { LoginDto } from './dto/login.dto';

@UseFilters(GlobalExceptionFilter)
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly response: Response) {}

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<any> {
      const result = await this.authService.login(loginDto);
      return this.response.success(result,"Berhasil login")
  }
}
