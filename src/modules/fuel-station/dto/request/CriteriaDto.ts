import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { FuelType } from "./FuelType";

export const CP_MAX = 99999;

export const CP_MIN = 1000;

export default class CriteriaDto {
  @ApiProperty( {
    description: "Código postal",
    minimum: CP_MIN,
    maximum: CP_MAX,
    example: 46100,
  } )
  @IsNumber()
  @Min(CP_MIN)
  @Max(CP_MAX)
    cp!: number;

  @ApiProperty( {
    description: "Tipo de combustible",
    example: FuelType.Gasolina95E5,
    enum: FuelType,
  } )
  @IsNotEmpty()
  @IsString()
  @IsEnum(FuelType)
  @Transform(( { value } ) => value.toUpperCase())
    type!: string;
}
