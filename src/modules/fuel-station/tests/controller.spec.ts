import { Test, TestingModule } from "@nestjs/testing";
import Controller from "../Controller";
import Service from "../Service";
import { CRITERIA_VALID } from "./CriteriaDtoSamples";
import { FUEL_STATION_INFO_DTO_ARRAY_VALID } from "./FuelStationInfoDtoSamples";
import ServiceMock from "./ServiceMock";

describe("FuelstationController", () => {
  let controller: Controller;
  let serviceMock: ServiceMock;

  beforeAll(async () => {
    serviceMock = new ServiceMock();
    const module: TestingModule = await Test.createTestingModule( {
      controllers: [Controller],
      providers: [{
        provide: Service,
        useValue: serviceMock,
      }],
    } ).compile();

    controller = module.get<Controller>(Controller);
  } );

  beforeEach(() => {
    jest.clearAllMocks();
  } );

  it("should be defined", () => {
    expect(controller).toBeDefined();
  } );

  describe("getList", () => {
    it("should call service.getListFrom function", () => {
      const params = CRITERIA_VALID;

      controller.getList(params);

      expect(serviceMock.getListFrom).toBeCalledWith(params);
    } );

    it("should return same value as service.getListFrom function", () => {
      const params = CRITERIA_VALID;
      const ret = FUEL_STATION_INFO_DTO_ARRAY_VALID;

      serviceMock.getListFrom.mockReturnValue(ret);

      expect(controller.getList(params)).toEqual(serviceMock.getListFrom(params));
    } );
  } );
} );
