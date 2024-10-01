import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // injects auth services
  const authService = inject(AuthService);

  // gets token
  const token = authService.getToken();

  // updates header
  const headers = req.headers.set('Authorization', `Bearer${token}`)
  
  // clone the request and send the modified request;
  const modifiedReq = req.clone({ headers });
  return next(modifiedReq);
  // return next(req);
};


// export const authenticationInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next:
//   HttpHandlerFn) => {
//      const userToken = 'MY_TOKEN'; const modifiedReq = req.clone({
//        headers: req.headers.set('Authorization', `Bearer ${userToken}`),
//      });
//      return next(modifiedReq);
//   };