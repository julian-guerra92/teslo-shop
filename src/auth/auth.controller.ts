import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces/valid-roles';

@ApiTags('Auth') //Decorador utilzado para etiqueta en endpoint de documentación
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User,) {
    return this.authService.checkAuthStatus(user);
  }

  //Método inicial de autenticación pero sin restricción de acceso
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    // @Req() request: Express.Request
    @GetUser() user: User, //Decorador personalizado
    @GetUser('email') userEmail: string, //Decorador personalizado
    @RawHeaders() rawHeaders: string[]
  ) {
    // console.log({user: request.user});
    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      userEmail,
      rawHeaders
    }
  }

  //Método de autenticación pero con restricción de acceso larga
  @Get('private2')
  //@SetMetadata('roles', ['admin', 'super-user']) //No se recomienda su uso. Puede haber errores.
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }

  //Método de autenticación pero con restricción de acceso más práctica
  @Get('private3')
  @Auth(ValidRoles.superUser)
  privateRoute3(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }

}

/*
Se hace uso de decorador personalizado con el fin de obtener la información del usuario y con esto gestionar accesos, permisos, etc. Esto se genera a partir del contexto de next (context execution)
*/