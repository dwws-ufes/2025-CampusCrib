import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth/auth.interceptor';
import { mockBackendInterceptor } from './mocks/mock-backend.interceptor';
import { environment } from '../environments/environment';

import { routes } from './app.routes';

const interceptors = environment.useMockBackend 
  ? [mockBackendInterceptor, authInterceptor]
  : [authInterceptor];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors(interceptors))
  ]
};
