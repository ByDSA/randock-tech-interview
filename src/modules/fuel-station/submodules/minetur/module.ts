import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import ThisService from "./service";

@Module( {
  imports: [HttpModule],
  providers: [ThisService],
  exports: [ThisService],
} )
export default class ThisModule {}
