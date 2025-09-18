
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JWTPayloadType } from 'src/utils/types';

export const CurrentUser = createParamDecorator(
  (data, context:ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const payload : JWTPayloadType = request['user'];
    return payload;
  },
);