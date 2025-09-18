import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';

export async function generateJWT(
  jwtService: JwtService,
  payload: JwtPayload,
): Promise<string> {
  return jwtService.signAsync(payload);
}
