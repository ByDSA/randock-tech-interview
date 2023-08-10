import { Body, Controller, Post, UseFilters } from "@nestjs/common";
import { ApiOkResponse, ApiTags, ApiUnprocessableEntityResponse } from "@nestjs/swagger";
import { HttpExceptionFilter } from "../../http-exception.filter";
import GetFuelStationPriceProductDto from "./dto/request/get-fuel-station-price-product.dto";
import FuelStationInfoDto from "./dto/response/fuelstation-info.dto";
import ThisService from "./service";

@Controller("fuelstations/search")
@ApiTags("fuelstations/search")
@UseFilters(new HttpExceptionFilter())
export default class ThisController {
  constructor(private readonly thisService: ThisService) {
  }

  @Post()
  @ApiOkResponse( {
    description: "Información obtenida satisfactoriamente",
    type: FuelStationInfoDto,
    isArray: true,
  } )
  @ApiUnprocessableEntityResponse( {
    description: "Error al procesar la información enviada",
  } )
  getList(
    @Body() getFuelstationInfoDto: GetFuelStationPriceProductDto,
  ): Promise<FuelStationInfoDto[]> {
    return this.thisService.getListFrom(getFuelstationInfoDto);
  }
}
