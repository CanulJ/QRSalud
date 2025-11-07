import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// 👇 Importa tu interceptor
import { LoaderInterceptor } from './interceptors/loader-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    importProvidersFrom(HttpClientModule),
    provideClientHydration(withEventReplay()),

    // 👇 Aquí registras el interceptor del loader
    provideHttpClient(withInterceptors([LoaderInterceptor])),
  ],
};
