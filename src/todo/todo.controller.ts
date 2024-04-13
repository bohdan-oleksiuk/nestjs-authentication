import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { Permission } from '../iam/authorization/permission.type';
import { Permissions } from '../iam/authorization/decorators/permissions.decorator';
import { Policies } from '../iam/authorization/decorators/policies.decorator';
import { FrameworkContributorPolicy } from '../iam/authorization/policies/framework-contributor.policy';

@ApiTags('Todo')
@ApiBearerAuth()
@Auth(AuthType.Bearer)
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Permissions(Permission.CreateTodo)
  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  findAll(@ActiveUser() user: ActiveUserData) {
    console.log(user);
    return this.todoService.findAll();
  }

  @Policies(
    new FrameworkContributorPolicy(),
    /**, new MinAgePolicy(18), new ETC()  */
  )
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}
