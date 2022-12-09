import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport'; //Necesario para el proceso de autenticación
import { JwtModule } from '@nestjs/jwt'; //Necesario para el proceso de autenticación
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]), //Configuración de las entidades
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // console.log('JWT SECRET', configService.get('JWT_SECRET'));
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '60m'
          }
        }
      }
    })
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: {
    //     expiresIn: '15m'
    //   }
    // })
  ],
  exports: [
    TypeOrmModule, 
    JwtStrategy, 
    PassportModule,
    JwtModule
  ]
})
export class AuthModule { }

/*
Para el proceso de autenticación, revisar la documentación para su configuración: 
  https://docs.nestjs.com/security/authentication#jwt-functionality
  Para este caso se usó los paquetes:
    - @nestjs/passport passport
    - @nestjs/jwt passport-jwt
    - @types/passport-jwt (tipado en desarrollo)
*/
