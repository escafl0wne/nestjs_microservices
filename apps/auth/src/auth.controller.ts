import { Body, Controller,Headers, Get, Post, Req, Res, UseGuards, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { LocalAuthGuard } from './guards/local.auth.guard';
// import { CurrentUser } from './current-user.decorator';
// import { UserDocument } from './users/models/users.schema';
import { Response } from 'express';
import { LoginUserDto } from './users/dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  

  
  @Post("login")

    async login(@Headers("cookie") header:string,@Body() loginUserDto:LoginUserDto,@Res({passthrough:true}) response:Response){
      if(!header) return this.authService.login(loginUserDto,response)
      else {
        
      const isValid = this.authService.validateToken(header,response)
      if(isValid) return { statusCode: HttpStatus.OK, message:"You are already logged in"};
      }
    }
  
}
