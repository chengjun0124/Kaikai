import { enableProdMode, forwardRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { UpgradeModule } from '@angular/upgrade/static';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { LoginComponent } from './app/pages/login/login.component';
import {UpgradeAdapter} from '@angular/upgrade';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));



// platformBrowserDynamic().bootstrapModule(AppModule).then(platformRef => {
//   const upgrade = platformRef.injector.get(UpgradeModule) as UpgradeModule;
//   upgrade.bootstrap(document.body, ['app'], { strictDi: false });
// });


