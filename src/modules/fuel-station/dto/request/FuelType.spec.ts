import { FuelType, stringToFuelTypeOrFail } from "./FuelType";

const DATASET_WITH_REAL_FUELTYPE_ENTRIES: [string, FuelType, string][] = Object.entries(FuelType)
  .map(([key, value]) => [
    value as string,
    FuelType[key as keyof typeof FuelType],
    key,
  ]);

describe.each(
  DATASET_WITH_REAL_FUELTYPE_ENTRIES,
)("Valid conversions", (str: string, expected: FuelType, key: string) => {
  test(`should convert string "${str}" to FuelType.${key}`, () => {
    const result = stringToFuelTypeOrFail(str);

    expect(result).toBe(expected);
  } );
} );

describe.each([
  "cosa",
  ...Object.keys(FuelType),
])("Invalid conversions", (str: string) => {
  test(`should throw an error tring to convert "${str}" to FuelType`, () => {
    expect(() => stringToFuelTypeOrFail(str)).toThrow();
  } );
} );
