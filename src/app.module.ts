import { Logger, Module, OnApplicationBootstrap } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { FuelStationModule } from "./modules/fuel-station";
import { MineturModule, MineturService } from "./modules/fuel-station/modules/minetur";

@Module( {
  imports: [
    FuelStationModule,
    RouterModule.register([
      {
        path: "fuel-stations",
        module: FuelStationModule,
      },

    ]),
    MineturModule,
  ],
  controllers: [],
  providers: [],
} )
export class AppModule implements OnApplicationBootstrap {
  readonly #logger = new Logger(AppModule.name);

  constructor(private mineturService: MineturService) {}

  onApplicationBootstrap() {
    const reloadCache = this.mineturService.reloadCacheOrFail.bind(this.mineturService);
    const reloadCacheAndRetryIfFail = (() => {
      reloadCache()
        .catch(() => {
          this.#logger.error("Error reloading cache. Retrying in 10 seconds");
          reloadCacheAndRetryIfFail();
        } );
    } );

    reloadCacheAndRetryIfFail();
    setInterval(reloadCacheAndRetryIfFail, ONE_HOUR_IN_MS);
  }
}

const ONE_HOUR_IN_MS = 60 * 60 * 1000;
