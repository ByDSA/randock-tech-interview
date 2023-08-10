import { Module } from "@nestjs/common";
import { FuelStationModule } from "./modules/fuel-station";

@Module( {
  imports: [FuelStationModule],
  controllers: [],
  providers: [],
} )
export class AppModule {}
