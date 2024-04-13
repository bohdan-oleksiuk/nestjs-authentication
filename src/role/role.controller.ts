import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { Roles } from '../iam/authorization/decorators/roles.decorator';

@ApiTags('Role')
@ApiBearerAuth()
@Auth(AuthType.Bearer)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Roles('string')
  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }
}
