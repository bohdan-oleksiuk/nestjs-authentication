import { PermissionType } from '../../iam/authorization/permission.type';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsArray()
  permissions: PermissionType[];
}
