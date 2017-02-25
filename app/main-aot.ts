import {platformBrowser}    from '@angular/platform-browser';
import {enableProdMode} from '@angular/core';

enableProdMode();

import {AppModuleNgFactory} from '../aot/app/app.module.ngfactory';
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);