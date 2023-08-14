import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import TestTimeout from "@test/TestTimeout";
import { HttpStatusCode } from "axios";
import { Cache } from "cache-manager";
import { validateSync } from "class-validator";
import * as request from "supertest";
import { addRequestDataValidationTo } from "../../../utils";
import { CONTROLLER_URL } from "../Controller";
import FuelStationModule from "../Module";
import FuelStationInfoDto from "../dto/response/FuelStationInfoDto";
import { PRODUCTS_VALID } from "../modules/minetur/tests/ProductosPetroliferosDtoSamples";
import { mockCacheWith } from "../modules/minetur/tests/utils";
import { CRITERIA_INVALID_CP_TOO_HIGH, CRITERIA_INVALID_CP_TOO_LOW, CRITERIA_INVALID_NO_CP, CRITERIA_INVALID_NO_TYPE, CRITERIA_INVALID_TYPE, CRITERIA_VALID } from "./CriteriaDtoSamples";

jest.setTimeout(TestTimeout.LOCAL_ACTION);

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let cacheManager: Cache;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule( {
      imports: [FuelStationModule],
    } ).compile();

    app = moduleFixture.createNestApplication();

    cacheManager = moduleFixture.get<Cache>(CACHE_MANAGER);

    addRequestDataValidationTo(app);
    await app.init();
  } );

  beforeEach(() => {
    jest.resetAllMocks();
  } );

  afterAll(async () => {
    await app.close();
  } );

  describe("/search (POST)", () => {
    describe("with no cache", () => {
      beforeEach(() => {
        mockCacheWith(cacheManager, undefined);
      } );

      it("should return a fuel station array", async () => {
        const response = await request(app.getHttpServer())
          .post("/search")
          .send(CRITERIA_VALID)
          .timeout(5 * 1000)
          .expect(HttpStatusCode.Ok) as any;
        const fuelStationsInfo: FuelStationInfoDto[] = response.body;

        expect(fuelStationsInfo).toBeInstanceOf(Array);
        expect(fuelStationsInfo.length).toBeGreaterThan(0);

        // Validación manual utilizando class-validator
        for (const fuelStation of fuelStationsInfo) {
          const errors = validateSync(fuelStation);

          expect(errors.length).toEqual(0);
        }
      }, TestTimeout.REMOTE_ACTION);
    } );

    describe("with cache", () => {
      beforeEach(() => {
        mockCacheWith(cacheManager, PRODUCTS_VALID);
      } );

      it("should use cache", async () => {
        await request(app.getHttpServer())
          .post("/search")
          .send(CRITERIA_VALID);
      } );
    } );

    describe("should throw an error if params are invalid", () => {
      it("no data is provided", () => request(app.getHttpServer())
        .post(CONTROLLER_URL)
        .expect(HttpStatusCode.UnprocessableEntity));

      it("no type is provided", () => request(app.getHttpServer())
        .post(CONTROLLER_URL)
        .send(CRITERIA_INVALID_NO_TYPE)
        .expect(HttpStatusCode.UnprocessableEntity));

      it("type is invalid", () => request(app.getHttpServer())
        .post(CONTROLLER_URL)
        .send(CRITERIA_INVALID_TYPE)
        .expect(HttpStatusCode.UnprocessableEntity));
      it("no cp is provided", () => request(app.getHttpServer())
        .post(CONTROLLER_URL)
        .send(CRITERIA_INVALID_NO_CP)
        .expect(HttpStatusCode.UnprocessableEntity));

      it("cp is lower than 1000", () => request(app.getHttpServer())
        .post(CONTROLLER_URL)
        .send(CRITERIA_INVALID_CP_TOO_LOW)
        .expect(HttpStatusCode.UnprocessableEntity));

      it("cp is greater than 99999", () => request(app.getHttpServer())
        .post(CONTROLLER_URL)
        .send(CRITERIA_INVALID_CP_TOO_HIGH)
        .expect(HttpStatusCode.UnprocessableEntity));
    } );
  } );
} );
