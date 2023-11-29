import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { AUTH_SERVICE } from "libs/common/constants/services";
import { map } from "rxjs";
import { tap } from "rxjs/internal/operators/tap";
import { UserDto } from "../dto";

@Injectable()
export class JwtAuthGuard implements CanActivate{
    constructor(@Inject(AUTH_SERVICE) private readonly authClient:ClientProxy){
        

    }
	canActivate(context: ExecutionContext) {
       
		const jwt = context.switchToHttp().getRequest().cookies?.auth;
        console.log({jwt})
        if(!jwt) return false
       
		return this.authClient.send<UserDto>('authenticate', {auth:jwt} ).pipe(
          
            tap((res)=>{
                
                context.switchToHttp().getRequest().user = res;
               
            }),
            map(()=> true)
        )
	}
}