import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { supabase } from './supabase.client';

interface User {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    // Próba logowania przez Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      throw new UnauthorizedException('Niepoprawny email lub hasło');
    }

    return data.user;
  }

  login(user: User) {
    const payload = { email: user.email, password: user.password };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(user: User) {
    this.logger.log(`user -->> ${JSON.stringify(user)}`);

    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
    });

    console.log('error?.message', error?.message);

    if (error || !data.user) {
      throw new UnauthorizedException(error?.message || 'Signup error');
    }

    const payload = { email: data.user.email, sub: data.user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: data.user,
    };
  }
}
