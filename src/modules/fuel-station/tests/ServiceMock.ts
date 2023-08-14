import { PublicMethodsOf } from "@app/utils";
import Service from "../Service";

export default class ServiceMock implements PublicMethodsOf<Service> {
  getListFrom = jest.fn();
}
