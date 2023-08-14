import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsUrl } from "class-validator";

export default class FuelStationInfoDto {
  @ApiProperty( {
    description: "Nombre de la estación de servicio",
    example: "GALP",
  } )
  @IsString()
    name!: string;

  @ApiProperty( {
    description: "Precio del combustible",
    example: 1.764,
  } )
  @IsNumber()
    price!: number;

  @ApiProperty( {
    description: "Dirección de la estación de servicio",
    example: "Burjassot CALLE DE VALENCIA, 4",
  } )
    address!: string;

  @ApiProperty( {
    description: "URL de Google Maps de la estación de servicio",
    example: "https://www.google.com/maps/search/?api=1&query=GALP%20Burjassot%20CALLE%20DE%20VALENCIA,%204",
  } )
  @IsUrl()
    url!: string;
}
