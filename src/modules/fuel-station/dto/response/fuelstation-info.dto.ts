import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsUrl } from "class-validator";

export default class FuelStationInfoDto {
  @ApiProperty( {
    description: "Nombre de la estación de servicio",
    example: "Repsol",
  } )
  @IsString()
    name: string;

  @ApiProperty( {
    description: "Precio del combustible",
    example: 1.2,
  } )
  @IsNumber()
    price: number;

  @ApiProperty( {
    description: "Dirección de la estación de servicio",
    example: "Calle de la Estación, 1, 46100 Burjassot, Valencia",
  } )
    address: string;

  @ApiProperty( {
    description: "URL de Google Maps de la estación de servicio",
    example: "https://goo.gl/maps/1q2w3e4r5t6y7u8i9o",
  } )
  @IsUrl()
    url: string;
}
