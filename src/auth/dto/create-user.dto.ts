import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class CreateUserDto {

    @ApiProperty({
        description: 'Email of user',
        uniqueItems: true
    }) // configuración para el endpoint de documentación del proyecto
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password of user',
        nullable: false
    }) // configuración para el endpoint de documentación del proyecto
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { //Espresión regular
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty({
        description: 'Password of user',
        nullable: false,
        minLength: 1
    }) // configuración para el endpoint de documentación del proyecto
    @IsString()
    @MinLength(1)
    fullName: string;

}