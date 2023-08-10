import { Test, TestingModule } from "@nestjs/testing";
import ThisService from "../service";

describe("FuelstationService", () => {
  let service: ThisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule( {
      providers: [ThisService],
    } ).compile();

    service = module.get<ThisService>(ThisService);
  } );

  it("should be defined", () => {
    expect(service).toBeDefined();
  } );
} );
