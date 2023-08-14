import { PublicMethodsOf } from "@app/utils";
import { Cache } from "cache-manager";

export default class CacheMock implements PublicMethodsOf<Cache> {
  del = jest.fn();

  reset = jest.fn();

  wrap = jest.fn();

  get = jest.fn();

  set = jest.fn();
}
