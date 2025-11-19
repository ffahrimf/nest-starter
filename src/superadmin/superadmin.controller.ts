import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  UseFilters,
  UseInterceptors,
  UseGuards,
  Request,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { CreateSuperadminDto } from './dto/create-superadmin.dto';
import { UpdateSuperadminDto } from './dto/update-superadmin.dto';
import { FilterDto } from './dto/filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'src/helper/response';
import { GlobalExceptionFilter } from 'src/global-exception.filter';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtUtilService } from 'src/jwt/jwt-util.service';
import { ApiTags } from '@nestjs/swagger';
import * as multer from 'multer';

@UseFilters(GlobalExceptionFilter)
@ApiTags('Superadmin')
@Controller('superadmin')
export class SuperadminController {
  constructor(
    private readonly superadminService: SuperadminService,
    private readonly responseHelper: Response,
    private readonly jwtUtilService: JwtUtilService,
  ) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() dto: CreateSuperadminDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<any> {
    const token = req.headers.authorization.split(' ')[1];
    const userId = this.jwtUtilService.getUserIdFromToken(token);

    if (file) {
      dto.photo = file;
    }

    const result = await this.superadminService.create(dto, userId);
    return this.responseHelper.created(result);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findQuery(@Query() filter: FilterDto): Promise<any> {
    const result = await this.superadminService.findQuery(filter);
    return this.responseHelper.success(result);
  }

  @Post('update')
  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Body() dto: UpdateSuperadminDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<any> {
    const token = req.headers.authorization.split(' ')[1];
    const userId = this.jwtUtilService.getUserIdFromToken(token);
    if (file) {
      dto.photo = file;
    }
    const result = await this.superadminService.update(dto, userId);
    return this.responseHelper.success(result);
  }

  @Post('delete/:id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Request() req): Promise<any> {
    const token = req.headers.authorization.split(' ')[1];
    const userId = this.jwtUtilService.getUserIdFromToken(token);

    const result = await this.superadminService.remove(+id, userId);
    return this.responseHelper.success(result);
  }
}
