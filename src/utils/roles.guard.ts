
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log(requiredRoles)
    if (!requiredRoles) {
      return true;
    }
    const  {user}  = context.switchToHttp().getRequest();
    console.log(user);
     
    const res=requiredRoles.some((role) => user.role?.includes(role));
    console.log(res)
    return res;
  }

}


//some func takes a callback and loop through all of the member of required role member
//if any of the required role is found then call back  func return true
