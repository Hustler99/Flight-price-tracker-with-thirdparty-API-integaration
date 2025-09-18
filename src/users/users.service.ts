import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'node_modules/bcryptjs';
import { LoginUserDto } from './dto/login.dto';
import { JwtPayload } from './../../node_modules/@types/jsonwebtoken/index.d';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider } from './auth.provider';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepoistory: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly AuthProvider:AuthProvider

  ) {}

  /**
   * Create New  User.
   * @param  CreateUserDto data for creating new user.
   * @returns new user created object.
   */
  public async registerUser(createUserDto: CreateUserDto) {
  return await   this.AuthProvider.registerUser(createUserDto);
  }


  
  /**
   * Login user.
   * @param  LoginUserDto data for login the exists user.
   * @returns Access token
   */
  public async loginUser(loginUserDto: LoginUserDto) {
    return await this.AuthProvider.loginUser(loginUserDto);
  }

    /**
   * Get Current User logged.
   * @param  userId userId from payload using headers auth.
   * @returns  currently user object.
   */
  public async getCurrentUser(id:number){
    const user = await this.userRepoistory.findOne({where:{id}});
    if(!user) throw new NotFoundException('User not found');
    return user;

  }
}
