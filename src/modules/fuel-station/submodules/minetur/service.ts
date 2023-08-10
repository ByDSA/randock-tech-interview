import { HttpService } from "@nestjs/axios";
import { BadGatewayException, Injectable, Logger } from "@nestjs/common";
import { FuelTypeEnum } from "../../dto/request/FuelType.enum";
import FuelStationInfoDto from "../../dto/response/fuelstation-info.dto";
import { ProductoPetroliferoDto } from "./dto/external/productos-petroliferos";

const URL_PRODUCTS = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/";

type Criteria = {
  cp: number;
  type: FuelTypeEnum;
};

const EXTERNAL_FUEL_TYPE: { [key in FuelTypeEnum]: string } = {
  [FuelTypeEnum.Biodiesel]: "Precio Biodiesel",
  [FuelTypeEnum.Bioetanol]: "Precio Bioetanol",
  [FuelTypeEnum.GasoleoA]: "Precio Gasoleo A",
  [FuelTypeEnum.GasoleoB]: "Precio Gasoleo B",
  [FuelTypeEnum.GasoleoPremium]: "Precio Gasoleo Premium",
  [FuelTypeEnum.Gasolina95E10]: "Precio Gasolina 95 E10",
  [FuelTypeEnum.Gasolina95E5]: "Precio Gasolina 95 E5",
  [FuelTypeEnum.Gasolina95E5Premium]: "Precio Gasolina 95 E5 Premium",
  [FuelTypeEnum.Gasolina98E10]: "Precio Gasolina 98 E10",
  [FuelTypeEnum.Gasolina98E5]: "Precio Gasolina 98 E5",
  [FuelTypeEnum.Hidrogeno]: "Precio Hidrogeno",
};

// https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/ProductosPetroliferos/
@Injectable()
export default class Service {
  private logger: Logger = new Logger("MineturService");

  constructor(private readonly httpService: HttpService) {
  }

  async getFuelStationInfo(criteria: Criteria): Promise<FuelStationInfoDto[]> {
    const { data } = await this.httpService.axiosRef.get(URL_PRODUCTS);

    if (data.ResultadoConsulta !== "OK")
      throw new BadGatewayException("Error getting products");

    const filteredData: ProductoPetroliferoDto[] = data.ListaEESSPrecio.filter(
      (product: ProductoPetroliferoDto) => {
        const productCP = +product["C.P."];
        const hasProduct = !!product[EXTERNAL_FUEL_TYPE[criteria.type]];

        return productCP === criteria.cp && hasProduct;
      },
    );
    const convertedData: FuelStationInfoDto[] = filteredData.map(
      (product: ProductoPetroliferoDto) => {
        const municipio = product.Municipio;
        const address = `${municipio} ${product["Dirección"]}`;
        const priceStr = product[EXTERNAL_FUEL_TYPE[criteria.type]].replace(",", ".");
        const price = +priceStr;
        const name = product["Rótulo"];
        const ret: FuelStationInfoDto = {
          address,
          name,
          price,
          url: new URL(`https://www.google.com/maps/search/?api=1&query=${name} ${address}`).href,
        };

        return ret;
      },
    );
    const sortedData: FuelStationInfoDto[] = convertedData.sort(
      (a: FuelStationInfoDto, b: FuelStationInfoDto) => a.price - b.price,
    );

    console.log(sortedData);

    return sortedData;
  }
}
