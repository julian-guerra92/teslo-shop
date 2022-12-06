import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @Type(() => Number) //Para transformar el parámetro que llega del query a number
    limit?: number;

    @IsOptional()
    @Min(0)
    @Type(() => Number) //Para transformar el parámetro que llega del query a number
    offset?: number;

}