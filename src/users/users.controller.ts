import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorators';
import type { JWTPayloadType } from 'src/utils/types';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @UseInterceptors()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.registerUser(createUserDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.loginUser(loginUserDto);
  }
  @Get('current-user')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  public getCurrentUser(@CurrentUser() payload: JWTPayloadType) {
    return this.usersService.getCurrentUser(payload.id);
  }
}
