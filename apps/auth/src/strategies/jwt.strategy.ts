import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../users/users.service";
import { Request } from "express";
import { TTokenPayload } from "@app/common/lib/types/token-payload.type";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor( configService:ConfigService, private readonly userService:UsersService){
        super({
            jwtFromRequest:ExtractJwt.fromExtractors([(req:any)=>{
                const token = req?.cookies?.auth || req?.auth
             
                return token}]),
            secretOrKey:configService.get("JWT_SECRET")
        })
    }
    async validate({userId}:TTokenPayload){
        
            return await this.userService.findUser({_id:userId})
       
      
    }
}