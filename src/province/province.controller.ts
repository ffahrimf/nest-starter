import {
  Controller,
  Get,
  UseGuards,
  UseFilters,
  Query,
  Post,
  Body,
  Request,
} from '@nestjs/common';
import { ProvinceService } from './province.service';
import { ApiTags } from '@nestjs/swagger';
import { FilterDto } from './dto/filter.dto';
import { Response } from 'src/helper/response';
import { GlobalExceptionFilter } from 'src/global-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import { CreateProvinceDto } from './dto/create-province.dto';
import { JwtUtilService } from 'src/jwt/jwt-util.service';

@UseFilters(GlobalExceptionFilter)
@ApiTags('Province')
@Controller('province')
export class ProvinceController {
  constructor(
    private readonly provinceService: ProvinceService,
    private readonly response: Response,
    private readonly jwtUtilService: JwtUtilService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findQuery(@Query() filter: FilterDto): Promise<any> {
    const result = await this.provinceService.findQuery(filter);
    return this.response.success(result);
  }

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() dto: CreateProvinceDto, @Request() req): Promise<any> {
    const token = req.headers.authorization.split(' ')[1];
    const userId = this.jwtUtilService.getUserIdFromToken(token);

    const result = await this.provinceService.create(dto, userId);
    return this.response.created(result);
  }
}
