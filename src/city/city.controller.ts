import {
  Controller,
  UseFilters,
  Get,
  Query,
  UseGuards,
  Post,
  Body,
  Request,
} from '@nestjs/common';
import { CityService } from './city.service';
import { ApiTags } from '@nestjs/swagger';
import { FilterDto } from './dto/filter.dto';
import { Response } from 'src/helper/response';
import { GlobalExceptionFilter } from 'src/global-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import { CreateCityDto } from './dto/create-city.dto';
import { JwtUtilService } from 'src/jwt/jwt-util.service';

@UseFilters(GlobalExceptionFilter)
@ApiTags('City')
@Controller('city')
export class CityController {
  constructor(
    private readonly cityService: CityService,
    private readonly response: Response,
    private readonly jwtUtilService: JwtUtilService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findQuery(@Query() filter: FilterDto): Promise<any> {
    const result = await this.cityService.findQuery(filter);
    return this.response.success(result);
  }

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() dto: CreateCityDto, @Request() req): Promise<any> {
    const token = req.headers.authorization.split(' ')[1];
    const userId = this.jwtUtilService.getUserIdFromToken(token);

    const result = await this.cityService.create(dto, userId);
    return this.response.created(result);
  }
}
