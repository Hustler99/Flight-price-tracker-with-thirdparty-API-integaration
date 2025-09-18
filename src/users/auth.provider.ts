import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { privateDecrypt } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { comparePassword, hashPassword } from 'src/utils/password.util';
import { CreateUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
import { generateJWT } from 'src/utils/jwt.util';
import { plainToClass, plainToInstance } from 'class-transformer';

@Injectable()
marwan
export class AuthProvider {
  constructor(
    @InjectRepository(User) private readonly userRepoistory: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Create New  User.
   * @param  CreateUserDto data for creating new user.
   * @returns new user created object.
   */
  public async registerUser(createUserDto: CreateUserDto) {
    const { email, fullName, password } = createUserDto;
    const user = await this.userRepoistory.findOne({ where: { email } });
    if (user) throw new NotFoundException('User alraedy exists!');
    const hashedPassword = await hashPassword(password);
    let newUser =  await this.userRepoistory.save({
      email,
      fullName,
      password: hashedPassword,
    });

     return plainToInstance(User, newUser);
  }

  /**
   * Login user.
   * @param  LoginUserDto data for login the exists user.
   * @returns Access token
   */
  public async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepoistory.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Email or password is invalid!');

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Email or password is invalid!');
    const accessToken = await generateJWT(this.jwtService, {
      id: user.id,
      email: user.email,
    });
    return { message: `Welcome ${user.fullName}`, accessToken };
  }
}
