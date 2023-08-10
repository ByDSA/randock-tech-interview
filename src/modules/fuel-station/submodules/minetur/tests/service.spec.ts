import { HttpModule } from "@nestjs/axios";
import { Test, TestingModule } from "@nestjs/testing";
import { FuelTypeEnum } from "../../../dto/request/FuelType.enum";
import ThisService from "../service";

describe("MineturService", () => {
  let service: ThisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule( {
      imports: [HttpModule],
      providers: [ThisService],
    } ).compile();

    service = module.get<ThisService>(ThisService);
  } );

  it("should be defined", () => {
    expect(service).toBeDefined();
  } );

  it("should get products", async () => {
    const products = await service.getFuelStationInfo( {
      cp: 46100,
      type: FuelTypeEnum.Gasolina95E5,
    } );

    expect(products).toBeDefined();
    expect(products.length).toBeGreaterThan(0);
  } );
} );
