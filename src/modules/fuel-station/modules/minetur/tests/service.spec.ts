import { HttpModule, HttpService } from "@nestjs/axios";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { BadGatewayException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { validateSync } from "class-validator";
import FuelStationInfoDto from "src/modules/fuel-station/dto/response/FuelStationInfoDto";
import { FuelType } from "../../../dto/request/FuelType";
import ThisService, { CACHE_KEY_PRODUCTS, CACHE_TIMEOUT } from "../Service";
import CacheMock from "./CacheMock";
import HttpServiceMock, { RESPONSE_INVALID_NOT_OK, RESPONSE_VALID } from "./HttpServiceMock";
import { PRODUCTS_VALID } from "./ProductosPetroliferosDtoSamples";
import { mockCacheWith } from "./utils";

describe("MineturService", () => {
  let service: ThisService;
  let httpService: HttpServiceMock;
  let cacheManager: CacheMock;

  function callGetFuelStationInfoOrFail() {
    return service.getFuelStationInfoOrFail( {
      cp: Number(PRODUCTS_VALID[0]["C.P."]),
      type: FuelType.Gasolina95E5,
    } );
  }

  beforeAll(async () => {
    httpService = new HttpServiceMock();
    cacheManager = new CacheMock();
    const module: TestingModule = await Test.createTestingModule( {
      imports: [HttpModule],
      providers: [ThisService, {
        provide: HttpService,
        useValue: httpService,
      },
      {
        provide: CACHE_MANAGER,
        useValue: cacheManager,
      },
      ],
    } )
      .compile();

    service = module.get<ThisService>(ThisService);
  } );

  beforeEach(() => {
    jest.clearAllMocks();
  } );

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(httpService).toBeDefined();
  } );

  describe("should get products", () => {
    let products: FuelStationInfoDto[];

    beforeAll(async () => {
      httpService.axiosRef.get.mockReturnValue(Promise.resolve(RESPONSE_VALID));
      products = await callGetFuelStationInfoOrFail();
    } );

    it("should be an array", () => {
      expect(products).toBeDefined();
      expect(products.length).toBeGreaterThan(0);
    } );

    it("should have correct data", () => {
      // Validación manual utilizando class-validator
      for (const fuelStation of products) {
        const errors = validateSync(fuelStation);

        expect(errors.length).toEqual(0);
      }
    } );
  } );

  it("should get products with empty result", () => {
    httpService.axiosRef.get.mockReturnValue(Promise.resolve(RESPONSE_VALID));

    const actual = service.getFuelStationInfoOrFail( {
      cp: 99999,
      type: FuelType.Gasolina95E5,
    } );

    expect(actual).resolves.toEqual([]);
  } );

  describe("error cases", () => {
    it("should throw error if result is not ok", () => {
      httpService.axiosRef.get.mockReturnValue(Promise.resolve(RESPONSE_INVALID_NOT_OK));

      const actual = service.getFuelStationInfoOrFail( {
        cp: Number(PRODUCTS_VALID[0]["C.P."]),
        type: FuelType.Gasolina95E5,
      } );

      expect(actual).rejects.toThrowError(BadGatewayException);
    } );
  } );

  describe("cache", () => {
    it("should comprobe cache", async () => {
      httpService.axiosRef.get.mockReturnValue(Promise.resolve(RESPONSE_VALID));
      await callGetFuelStationInfoOrFail();

      expect(cacheManager.get).toHaveBeenCalled();
    } );
    it("should request by HTTP if cache is empty and add to cache", async () => {
      httpService.axiosRef.get.mockReturnValue(Promise.resolve(RESPONSE_VALID));
      await callGetFuelStationInfoOrFail();

      expect(httpService.axiosRef.get).toHaveBeenCalled();
      expect(cacheManager.set).toHaveBeenCalledWith(
        CACHE_KEY_PRODUCTS,
        PRODUCTS_VALID,
        CACHE_TIMEOUT,
      );
    } );
    it("should not request by HTTP if it's cached", async () => {
      mockCacheWith(cacheManager, PRODUCTS_VALID);
      await callGetFuelStationInfoOrFail();

      expect(httpService.axiosRef.get).not.toHaveBeenCalled();
      expect(cacheManager.set).not.toHaveBeenCalled();
    } );
  } );
} );
