import { PublicMethodsOf } from "@app/utils";
import { Cache } from "cache-manager";

export function mockCacheWith(cache: PublicMethodsOf<Cache>, values: any) {
  jest.spyOn(cache, "get").mockResolvedValue(values);
}
