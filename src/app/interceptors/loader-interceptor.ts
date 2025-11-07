import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../Services/loader.service';

export const LoaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  loaderService.show(); // Mostrar loader al iniciar la petición

  return next(req).pipe(
    finalize(() => loaderService.hide()) // Ocultar loader al terminar
  );
};
