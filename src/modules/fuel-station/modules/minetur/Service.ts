import { neverCheckError } from "@app/utils";
import { HttpService } from "@nestjs/axios";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { BadGatewayException, Inject, Injectable, Logger } from "@nestjs/common";
import { Cache } from "cache-manager";
import { validateSync } from "class-validator";
import CriteriaDto from "../../dto/request/CriteriaDto";
import { FuelType } from "../../dto/request/FuelType";
import FuelStationInfoDto from "../../dto/response/FuelStationInfoDto";
import ProductoPetroliferoDto from "./dto/ProductoPetroliferoDto";

const URL_PRODUCTS = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/";

function typeToFieldOrFail(type: FuelType): keyof ProductoPetroliferoDto {
  switch (type) {
    case FuelType.Biodiesel:
      return "Precio Biodiesel";
    case FuelType.Bioetanol:
      return "Precio Bioetanol";
    case FuelType.GasoleoA:
      return "Precio Gasoleo A";
    case FuelType.GasoleoB:
      return "Precio Gasoleo B";
    case FuelType.GasoleoC:
      return "Precio Gasoleo C";
    case FuelType.GasoleoPremium:
      return "Precio Gasoleo Premium";
    case FuelType.Gasolina95E10:
      return "Precio Gasolina 95 E10";
    case FuelType.Gasolina95E5:
      return "Precio Gasolina 95 E5";
    case FuelType.Gasolina95E5Premium:
      return "Precio Gasolina 95 E5 Premium";
    case FuelType.Gasolina98E10:
      return "Precio Gasolina 98 E10";
    case FuelType.Gasolina98E5:
      return "Precio Gasolina 98 E5";
    case FuelType.Hidrogeno:
      return "Precio Hidrogeno";
    default:
      throw neverCheckError(type);
  }
}
const ERROR_GETTING_PRODUCTS = new BadGatewayException("Error getting products");

export const CACHE_KEY_PRODUCTS = "products";

export const CACHE_TIMEOUT = 1.5 * 60 * 60 * 1000; // 1:30h

@Injectable()
export default class MineturService {
  #logger: Logger = new Logger(MineturService.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
  }

  async getFuelStationInfoOrFail(criteria: CriteriaDto): Promise<FuelStationInfoDto[]> {
    let list: any = await this.cacheManager.get(CACHE_KEY_PRODUCTS);

    if (!list)
      list = await this.#reloadCacheAndGetOrFail();

    const filteredData: ProductoPetroliferoDto[] = filterByCriteria(list, criteria);
    const convertedData: FuelStationInfoDto[] = filteredData.map(
      (product: ProductoPetroliferoDto) => productoPetroliferoToFuelStationInfo(product, criteria),
    );
    const sortedData = sortByPriceAsc(convertedData);

    return sortedData;
  }

  #checkIsProductosPetroliferos(productos: any[]): productos is ProductoPetroliferoDto[] {
    if (!productos || !Array.isArray(productos))
      return false;

    for (const productoPetrolifero of productos) {
      const errors = validateSync(productoPetrolifero);

      if (errors.length > 0) {
        this.#logger.error(errors);

        return false;
      }
    }

    return true;
  }

  async #reloadCacheAndGetOrFail(): Promise<ProductoPetroliferoDto[]> {
    const { data } = await this.httpService.axiosRef.get(URL_PRODUCTS);

    if (data.ResultadoConsulta !== "OK")
      throw ERROR_GETTING_PRODUCTS;

    const list = data.ListaEESSPrecio;

    if (!this.#checkIsProductosPetroliferos(list))
      throw ERROR_GETTING_PRODUCTS;

    // Se invalida en 1:30h, pero se actualiza cada 1:00h
    await this.cacheManager.set(CACHE_KEY_PRODUCTS, list, CACHE_TIMEOUT);

    this.#logger.log("Cache reloaded");

    return list;
  }

  async reloadCacheOrFail(): Promise<void> {
    await this.#reloadCacheAndGetOrFail();
  }
}

function filterByCriteria(
  productosPetroliferos: ProductoPetroliferoDto[],
  criteria: CriteriaDto,
): ProductoPetroliferoDto[] {
  return productosPetroliferos.filter(
    (product: ProductoPetroliferoDto) => {
      const productCP = +product["C.P."];

      if (productCP !== criteria.cp)
        return false;

      const fuelType = criteria.type as FuelType; // Ya se comprueba en request

      try {
        const productTypeField: keyof ProductoPetroliferoDto = typeToFieldOrFail(fuelType);
        // Se considera que no se tiene el producto requerido
        // si el tipo de producto tiene valor "" o no existe
        const hasAskedProduct = !!(product[productTypeField] ?? "");

        if (!hasAskedProduct)
          return false;

        return true;
      } catch (e) {
        return false;
      }
    },
  );
}
function sortByPriceAsc(data: FuelStationInfoDto[]): FuelStationInfoDto[] {
  // TODO: remplazar por toSorted (ES2023) en Node 20
  return data.sort((a: FuelStationInfoDto, b: FuelStationInfoDto) => a.price - b.price);
}

function productoPetroliferoToFuelStationInfo(
  product: ProductoPetroliferoDto,
  criteria: CriteriaDto,
) {
  const municipio = product.Municipio;
  const address = `${municipio} ${product.Dirección}`;
  const productPriceField = typeToFieldOrFail(criteria.type as FuelType);
  const productPriceStr = product[productPriceField] as string;
  const productPriceDotNotation = productPriceStr.replace(",", ".");
  const producPrice = +productPriceDotNotation;
  const name = product.Rótulo;
  const ret: FuelStationInfoDto = {
    address,
    name,
    price: producPrice,
    url: generateGoogleMapsUrl(name, address).href,
  };

  return ret;
}

function generateGoogleMapsUrl(
  name: string,
  address: string,
): URL {
  return new URL(`https://www.google.com/maps/search/?api=1&query=${name} ${address}`);
}
