import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (
    req.url.includes('geoapify.com') ||
    req.url.includes('maps.geoapify.com') ||
    req.url.includes('openweathermap.org') ||
      req.url.includes('news.google.com')
  ) {
    return next(req);
  }

  const token = localStorage.getItem('token');

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};