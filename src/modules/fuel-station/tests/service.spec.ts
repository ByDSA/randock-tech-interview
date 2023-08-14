import { Test, TestingModule } from "@nestjs/testing";
import FuelStationService from "../Service";
import { MineturService } from "../modules/minetur";
import MineturServiceMock from "../modules/minetur/tests/ServiceMock";
import { CRITERIA_VALID } from "./CriteriaDtoSamples";
import { FUEL_STATION_INFO_DTO_ARRAY_VALID } from "./FuelStationInfoDtoSamples";

describe("FuelstationService", () => {
  let service: FuelStationService;
  let mineturServiceMock: MineturServiceMock;

  beforeAll(async () => {
    mineturServiceMock = new MineturServiceMock();
    const module: TestingModule = await Test.createTestingModule( {
      imports: [],
      providers: [
        FuelStationService,
        {
          provide: MineturService,
          useValue: mineturServiceMock,
        },
      ],
    } ).compile();

    service = module.get<FuelStationService>(FuelStationService);
  } );

  beforeEach(() => {
    jest.clearAllMocks();
  } );

  it("should be defined", () => {
    expect(service).toBeDefined();
  } );

  describe("getListFrom", () => {
    it("should call mineturService.getFuelStationInfo function", () => {
      const params = CRITERIA_VALID;

      service.getListFrom(params);

      expect(mineturServiceMock.getFuelStationInfoOrFail).toHaveBeenCalledWith(params);
    } );

    it("should return same as mineturService.getFuelStationInfo function", async () => {
      const params = CRITERIA_VALID;

      mineturServiceMock.getFuelStationInfoOrFail.mockReturnValue(
        Promise.resolve(FUEL_STATION_INFO_DTO_ARRAY_VALID),
      );

      const expected = await mineturServiceMock.getFuelStationInfoOrFail(params);
      const actual = await service.getListFrom(params);

      expect(actual).toBe(expected);
    } );
  } );
} );
