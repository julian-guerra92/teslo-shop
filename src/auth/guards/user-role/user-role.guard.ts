import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());
    if(!validRoles || validRoles.length === 0) return true;
    const req = context.switchToHttp().getRequest();
    const user: User = req.user;
    if(!user)
      throw new BadRequestException('User not found');
    for (const role of user.roles) {
      if(validRoles.includes(role)){
        return true;
      }
    }
    throw new ForbiddenException(
      `User ${user.fullName} nedd a valid role: [${validRoles}]`
    )
  }

}
