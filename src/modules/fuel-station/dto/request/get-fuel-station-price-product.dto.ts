import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { FuelTypeEnum } from "./FuelType.enum";

const CP_MAX = 99999;
const CP_MIN = 1000;

export default class GetFuelStationPriceProductDto {
  @ApiProperty( {
    description: "Código postal",
    minimum: CP_MIN,
    maximum: CP_MAX,
    example: 46100,
  } )
  @IsNumber()
  @Min(CP_MIN)
  @Max(CP_MAX)
    cp: number;

  @ApiProperty( {
    description: "Tipo de combustible",
    example: "Gasolina 95 E5",
    enum: FuelTypeEnum,
  } )
  @IsNotEmpty()
  @IsString()
  @IsEnum(FuelTypeEnum)
  @Transform(( { value } ) => value.toUpperCase())
    type: string;
}
