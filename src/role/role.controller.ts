import { Controller,Get,UseGuards,UseFilters, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiTags } from '@nestjs/swagger';
import { FilterDto } from './dto/filter.dto';
import { Response } from 'src/helper/response';
import { GlobalExceptionFilter } from 'src/global-exception.filter';
import { AuthGuard } from '@nestjs/passport';

@UseFilters(GlobalExceptionFilter)
@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService,
    private readonly response: Response) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findQuery(@Query() filter:FilterDto) : Promise<any>{
    const result = await this.roleService.findQuery(filter);
    return this.response.success(result);
  }
}
