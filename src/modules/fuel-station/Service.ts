import { Injectable, Logger } from "@nestjs/common";
import CriteriaDto from "./dto/request/CriteriaDto";
import { FuelType } from "./dto/request/FuelType";
import FuelStationInfoDto from "./dto/response/FuelStationInfoDto";
import { MineturService } from "./modules/minetur";

@Injectable()
export default class FuelStationService {
  readonly #logger = new Logger(FuelStationService.name);

  constructor(private readonly mineturService: MineturService) {
  }

  async getListFrom(
    fuelStationRequest: CriteriaDto,
  ): Promise<FuelStationInfoDto[]> {
    const { cp } = fuelStationRequest;
    const type = fuelStationRequest.type as FuelType; // Ya se comprueba con class-validator
    const res: Array<FuelStationInfoDto> = await this.mineturService.getFuelStationInfoOrFail( {
      cp,
      type,
    } );

    this.#logger.log(`getListFrom: ${JSON.stringify(res, null, 2)}`);

    return Promise.resolve(res);
  }
}
