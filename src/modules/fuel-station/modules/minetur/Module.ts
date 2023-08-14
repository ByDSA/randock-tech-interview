import { HttpModule } from "@nestjs/axios";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import Service from "./Service";

@Module( {
  imports: [HttpModule, CacheModule.register( {
  } )],
  providers: [Service],
  exports: [Service, HttpModule],
} )
export default class ThisModule {}
