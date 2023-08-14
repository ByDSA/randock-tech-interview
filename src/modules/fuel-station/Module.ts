import { Module } from "@nestjs/common";
import ControllerImp from "./Controller";
import ServiceImp from "./Service";
import { MineturModule } from "./modules/minetur";

@Module( {
  providers: [ServiceImp],
  controllers: [ControllerImp],
  imports: [MineturModule],
} )
export default class FuelStationModule {}
