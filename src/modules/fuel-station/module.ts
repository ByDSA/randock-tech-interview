import { Module } from "@nestjs/common";
import ThisController from "./controller";
import ThisService from "./service";
import { MineturModule } from "./submodules/minetur";

@Module( {
  providers: [ThisService],
  controllers: [ThisController],
  imports: [MineturModule],
} )
export default class ThisModule {}
