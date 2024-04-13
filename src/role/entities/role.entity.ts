import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import {
  Permission,
  PermissionType,
} from '../../iam/authorization/permission.type';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column({ unique: true })
  value: string;

  @Column({ enum: Permission, default: [], type: 'json' })
  permissions: PermissionType[];

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
