import { ApiProperty } from "@nestjs/swagger";
import {
    IsEmail,
    IsString
} from "class-validator";

export class LoginUserDto {

    @ApiProperty({
        description: 'Email of user',
        nullable: false
    }) // configuración para el endpoint de documentación del proyecto
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password of user',
        nullable: false
    }) // configuración para el endpoint de documentación del proyecto
    @IsString()
    password: string;

}