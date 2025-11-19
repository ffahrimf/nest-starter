import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'src/helper/response';
import { ApiTags } from '@nestjs/swagger';
import { GlobalExceptionFilter } from 'src/global-exception.filter';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@UseFilters(GlobalExceptionFilter)
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly response: Response,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    const result = await this.authService.login(loginDto);
    return this.response.success(result, 'Login Successfully');
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshTokenDto): Promise<any> {
    const result = await this.authService.refreshAccessToken(
      refreshDto.refresh_token,
    );
    return this.response.success(result, 'Successfully Refresh Token');
  }
}
