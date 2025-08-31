import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class SupabaseJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'] as string;

    if (!authHeader) throw new UnauthorizedException('No token');

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token)
      throw new UnauthorizedException('Invalid token');

    try {
      const publicKey = process.env.SUPABASE_JWT_KEY!;
      const decoded = jwt.verify(token, publicKey, {
        algorithms: ['HS256'],
      }) as any;

      request['user'] = decoded;

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
