import {
  Controller,
  Post,
  UseGuards,
  Body,
  Logger,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthService.name);
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    console.log('SIGNUP -> body -> ', body);

    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  // @UseGuards(LocalAuthGuard)
  @Post('signup')
  async signup(@Body() body: { email: string; password: string }) {
    this.logger.log(`BODY -->> ${JSON.stringify(body)}`);
    const response = await this.authService.signup(body);
    console.log('response', response);
    return response;
  }

  @UseGuards(LocalAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
