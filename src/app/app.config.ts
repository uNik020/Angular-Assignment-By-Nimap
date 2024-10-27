import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(ReactiveFormsModule),  // <-- Add this
    importProvidersFrom(FormsModule),          // <-- Add this
    importProvidersFrom(NgSelectModule) ,
    importProvidersFrom(ReactiveFormsModule), provideAnimationsAsync(), provideAnimationsAsync()
  ]
};
