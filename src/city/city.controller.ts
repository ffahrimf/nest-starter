import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseFilters,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { FilterDto } from './dto/filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'src/helper/response';
import { GlobalExceptionFilter } from 'src/global-exception.filter';
import { JwtUtilService } from 'src/jwt/jwt-util.service';
import { ApiTags } from '@nestjs/swagger';

@UseFilters(GlobalExceptionFilter)
@ApiTags('City')
@Controller('city')
export class CityController {
  constructor(
    private readonly cityService: CityService,
    private readonly responseHelper: Response,
    private readonly jwtUtilService: JwtUtilService,
  ) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() dto: CreateCityDto, @Request() req): Promise<any> {
    const token = req.headers.authorization.split(' ')[1];
    const userId = this.jwtUtilService.getUserIdFromToken(token);
    const result = await this.cityService.create(dto, userId);
    return this.responseHelper.success(result);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findQuery(@Query() filter: FilterDto): Promise<any> {
    const result = await this.cityService.findQuery(filter);
    return this.responseHelper.success(result);
  }

  @Post('update')
  @UseGuards(AuthGuard('jwt'))
  async update(@Body() dto: UpdateCityDto, @Request() req): Promise<any> {
    const token = req.headers.authorization.split(' ')[1];
    const userId = this.jwtUtilService.getUserIdFromToken(token);
    const result = await this.cityService.update(dto, userId);
    return this.responseHelper.success(result);
  }

  @Post('delete/:id')
  async remove(@Param('id') id: string, @Request() req): Promise<any> {
    const token = req.headers.authorization.split(' ')[1];
    const userId = this.jwtUtilService.getUserIdFromToken(token);
    const result = await this.cityService.remove(+id, userId);
    return this.responseHelper.success(result);
  }
}
