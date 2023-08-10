import { Injectable, Logger } from "@nestjs/common";
import { FuelTypeEnum } from "./dto/request/FuelType.enum";
import GetFuelStationPriceProductDto from "./dto/request/get-fuel-station-price-product.dto";
import FuelStationInfoDto from "./dto/response/fuelstation-info.dto";
import { MineturService } from "./submodules/minetur";

@Injectable()
export default class ThisService {
  private readonly logger = new Logger(ThisService.name);

  constructor(private readonly mineturService: MineturService) {
  }

  async getListFrom(
    fuelStationRequest: GetFuelStationPriceProductDto,
  ): Promise<FuelStationInfoDto[]> {
    const { cp } = fuelStationRequest;
    const type = fuelStationRequest.type as FuelTypeEnum; // Ya se comprueba con class-validator
    const res: Array<FuelStationInfoDto> = await this.mineturService.getFuelStationInfo( {
      cp,
      type,
    } );

    this.logger.log(`getListFrom: ${JSON.stringify(res, null, 2)}`);

    return Promise.resolve(res);
  }
}
