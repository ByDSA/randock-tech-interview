import CriteriaDto, { CP_MAX, CP_MIN } from "../dto/request/CriteriaDto";
import { FuelType } from "../dto/request/FuelType";

export const CRITERIA_VALID: CriteriaDto = Object.freeze( {
  cp: 46100,
  type: FuelType.Gasolina95E5,
} );

export const CRITERIA_INVALID_TYPE: CriteriaDto = Object.freeze( {
  ...CRITERIA_VALID,
  type: "any",
} );

export const CRITERIA_INVALID_NO_TYPE: Omit<CriteriaDto, "type"> = Object.freeze( {
  cp: CRITERIA_VALID.cp,
} );

export const CRITERIA_INVALID_CP_TOO_LOW: CriteriaDto = Object.freeze( {
  ...CRITERIA_VALID,
  cp: CP_MIN - 1,
} );

export const CRITERIA_INVALID_NO_CP: Omit<CriteriaDto, "cp"> = Object.freeze( {
  type: CRITERIA_VALID.type,
} );

export const CRITERIA_INVALID_CP_TOO_HIGH: CriteriaDto = Object.freeze( {
  ...CRITERIA_VALID,
  cp: CP_MAX + 1,
} );
