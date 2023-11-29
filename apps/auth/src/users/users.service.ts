import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { Logger } from 'nestjs-pino';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly logger: Logger,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hsdPass = await bcrypt.hash(createUserDto.password, salt);

      const user = await this.usersRepository.create({
        ...createUserDto,
        password: hsdPass,
      });
      delete user.password;
      return user;
    } catch (error) {
      if (error.message.includes('E11000 duplicate key error collection'))
        return { error: 'Email already exists', payload: error };
    }
  }
  async findAll() {
    return await this.usersRepository.find({});
  }
  async verifyUser(email?: string, password?: string, userId?: string) {
    const user = await this.usersRepository.findOne(
      email ? { email } : { _id: userId },
    );

    if (!user) throw new NotFoundException('User not found');
    if (userId) return user;
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      throw new UnauthorizedException('Credentials are incorrect');

    return user;
  }
  async findUser(_id: FindUserDto) {
    return await this.usersRepository.findOne({ _id });
  }
}
