import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './../../../node_modules/@types/jsonwebtoken/index.d';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly ConfigService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('no token provided');
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token)
      throw new UnauthorizedException('Invalid Token');

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.ConfigService.get<string>('JWT_SECRET'),
      });
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('access denied, invalid token');
    }
  }
}
