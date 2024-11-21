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
import { ProvinceService } from './province.service';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { FilterDto } from './dto/filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'src/helper/response';
import { GlobalExceptionFilter } from 'src/global-exception.filter';
import { JwtUtilService } from 'src/jwt/jwt-util.service';
import { ApiTags } from '@nestjs/swagger';

@UseFilters(GlobalExceptionFilter)
@ApiTags('Province')
@Controller('province')
export class ProvinceController {
  constructor(
    private readonly provinceService: ProvinceService,
    private readonly responseHelper: Response,
    private readonly jwtUtilService: JwtUtilService,
  ) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() dto: CreateProvinceDto, @Request() req): Promise<any> {
    const token = req.headers.authorization.split(' ')[1];
    const userId = this.jwtUtilService.getUserIdFromToken(token);
    const result = await this.provinceService.create(dto, userId);
    return this.responseHelper.success(result);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findQuery(@Query() filter: FilterDto): Promise<any> {
    const result = await this.provinceService.findQuery(filter);
    return this.responseHelper.success(result);
  }

  @Post('update')
  @UseGuards(AuthGuard('jwt'))
  async update(@Body() dto: UpdateProvinceDto, @Request() req): Promise<any> {
    const token = req.headers.authorization.split(' ')[1];
    const userId = this.jwtUtilService.getUserIdFromToken(token);
    const result = await this.provinceService.update(dto, userId);
    return this.responseHelper.success(result);
  }

  @Post('delete/:id')
  async remove(@Param('id') id: string, @Request() req): Promise<any> {
    const token = req.headers.authorization.split(' ')[1];
    const userId = this.jwtUtilService.getUserIdFromToken(token);
    const result = await this.provinceService.remove(+id, userId);
    return this.responseHelper.success(result);
  }
}
