import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { UserDocument } from './users/models/users.schema';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './users/dto/login-user.dto';
import { UsersRepository } from './users/users.repository';
import { UsersService } from './users/users.service';
import { TTokenPayload } from '@app/common/lib/types/token-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  private async signToken(payload: TTokenPayload, response: Response) {
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRES'),
    );
    const token = this.jwtService.sign(payload);

    response.cookie('auth', token, {
      httpOnly: true,
      expires,
    });
  }

  async login({ email, password }: LoginUserDto, response: Response) {
    const user = await this.usersService.verifyUser(email, password);
    if (!user) throw new UnauthorizedException('User not found');
    const tokenPayload = {
      userId: user._id.toHexString(),
    };
    this.signToken(tokenPayload, response);
  }
  async validateToken(header: string, response: Response,existingUser:UserDocument){
    const token = header.split('=')[1];
    const payload = this.jwtService.decode(token);
    
    if(!payload || !payload["userId"] || payload['userId'] !== existingUser._id.toHexString()) return false
       
    this.signToken({userId:payload["userId"]},response)
    return true
    
    

   
  }

}
