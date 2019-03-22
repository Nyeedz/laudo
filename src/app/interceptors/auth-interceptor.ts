import { Injectable, NgModule } from '@angular/core'
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable()
export class HttpsRequestInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const jwtObject = JSON.parse(localStorage.getItem("currentUser"));
    const jwt = jwtObject.jwt
    let cloneRequest = req
    
    if (jwt){
      cloneRequest = req.clone({
        headers: req.headers.set(
          'Authorization',
          `Bearer ${jwt}`
        ),
      })
    }
    return next.handle(cloneRequest)
  }
}

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpsRequestInterceptor,
      multi: true,
    },
  ],
})
export class AuthInterceptor {}