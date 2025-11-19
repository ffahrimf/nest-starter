import {
  Controller,
  Get,
  UseGuards,
  UseFilters,
  Query,
  Post,
  Body,
  Request,
  Param,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiTags } from '@nestjs/swagger';
import { FilterDto } from './dto/filter.dto';
import { Response } from 'src/helper/response';
import { GlobalExceptionFilter } from 'src/global-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import { CreateRoleDto } from './dto/create-role.dto';
import { JwtUtilService } from 'src/jwt/jwt-util.service';

@UseFilters(GlobalExceptionFilter)
@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly response: Response,
    private readonly jwtUtilService: JwtUtilService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findQuery(@Query() filter: FilterDto): Promise<any> {
    const result = await this.roleService.findQuery(filter);
    return this.response.success(result);
  }

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() dto: CreateRoleDto, @Request() req): Promise<any> {
    const token = req.headers.authorization.split(' ')[1];
    const userId = this.jwtUtilService.getUserIdFromToken(token);

    const result = await this.roleService.create(dto, userId);
    return this.response.created(result);
  }

  @Post('delete/:id')
  async remove(@Param('id') id: string, @Request() req): Promise<any> {
    const token = req.headers.authorization.split(' ')[1];
    const userId = this.jwtUtilService.getUserIdFromToken(token);

    const result = await this.roleService.remove(+id, userId);
    return this.response.success(result);
  }
}
