import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../role/entities/role.entity';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find({
      relations: { roles: true },
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: { roles: true },
    });
  }
}
