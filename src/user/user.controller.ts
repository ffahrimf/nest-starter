import { Controller, Get, Post, Body, Query, Param, UseFilters,UseGuards,Request } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'src/helper/response';
import { ApiTags } from '@nestjs/swagger';
import { GlobalExceptionFilter } from 'src/global-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import { JwtUtilService } from 'src/jwt/jwt-util.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { FilterDto } from './dto/filter.dto';

@UseFilters(GlobalExceptionFilter)
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly response: Response,
    private readonly jwtUtilService: JwtUtilService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findQuery(@Query() filter: FilterDto): Promise<any> {
      const result = await this.userService.findQuery(filter);
      return this.response.success(result);
    }
    
    @Post('create')
    @UseGuards(AuthGuard('jwt'))
    async create(@Body() dto: CreateUserDto, @Request() req): Promise<any> {
      const token = req.headers.authorization.split(' ')[1];
      const userId = this.jwtUtilService.getUserIdFromToken(token);
      
      const result = await this.userService.create(dto,userId);
      return this.response.success(result);
    }

    @Post('update-password')
    @UseGuards(AuthGuard('jwt'))
    async updatePassword(@Body() dto: UpdatePasswordDto, @Request() req): Promise<any> {
      const token = req.headers.authorization.split(' ')[1];
      const userId = this.jwtUtilService.getUserIdFromToken(token);
      
      const result = await this.userService.updatePassword(dto,userId);
      return this.response.success(result);
    }
}
