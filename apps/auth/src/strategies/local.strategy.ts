import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UsersService } from "../users/users.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private readonly usersService:UsersService){
        super();
      
    }
    async validate(email:string,password:string){
        const user = await this.usersService.verifyUser(email,password);
        return user
        // try {
        //     return await this.usersService;
        // } catch (error) {
        //     return new UnauthorizedException({"message":"Wrong credentials"},error)
        // }
        
    
    }
}