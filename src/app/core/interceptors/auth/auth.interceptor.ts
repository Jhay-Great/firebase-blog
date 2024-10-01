import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // clone the request and send the modified request;
  const token = '';
  const headers = req.headers.set('Authorization', `Bearer${token}`)
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