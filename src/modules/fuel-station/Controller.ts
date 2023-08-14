import { Body, Controller, HttpCode, Post, UseFilters, Version } from "@nestjs/common";
import { ApiBadGatewayResponse, ApiOkResponse, ApiTags, ApiUnprocessableEntityResponse } from "@nestjs/swagger";
import { HttpStatusCode } from "axios";
import { HttpExceptionFilter } from "../../http-exception.filter";
import Service from "./Service";
import CriteriaDto from "./dto/request/CriteriaDto";
import FuelStationInfoDto from "./dto/response/FuelStationInfoDto";

export const CONTROLLER_URL: string = "/search";

@Controller(CONTROLLER_URL)
@ApiTags(CONTROLLER_URL)
@UseFilters(new HttpExceptionFilter())
export default class FuelStationController {
  constructor(private readonly service: Service) {
  }

  @ApiOkResponse( {
    description: "Información obtenida satisfactoriamente",
    type: FuelStationInfoDto,
    isArray: true,
  } )
  @ApiUnprocessableEntityResponse( {
    description: "Error al procesar la información enviada",
  } )
  @ApiBadGatewayResponse( {
    description: "Error al obtener la información",
  } )
  @Version("1")
  @HttpCode(HttpStatusCode.Ok)
  @Post()
  getList(
    @Body() getFuelstationInfoDto: CriteriaDto,
  ): Promise<FuelStationInfoDto[]> {
    return this.service.getListFrom(getFuelstationInfoDto);
  }
}
