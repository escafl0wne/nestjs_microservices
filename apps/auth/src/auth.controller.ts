import {
  Body,
  Controller,
  Headers,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { LocalAuthGuard } from './guards/local.auth.guard';
// import { CurrentUser } from './current-user.decorator';
// import { UserDocument } from './users/models/users.schema';
import { Response } from 'express';
import { LoginUserDto } from './users/dto/login-user.dto';

import { AuthGuard } from '@nestjs/passport';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Request() req: any,
    @Headers('cookie') header: string,
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!header) return this.authService.login(loginUserDto, response);
    else {
      const isValid = await this.authService.validateToken(
        header,
        response,
        req.user,
      );
      if (isValid)
        return {
          User: req.user,
          statusCode: HttpStatus.OK,
          message: 'You are already logged in',
        };
    }
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate( @Payload() data: any) {
   return data.user
    
  }
}
