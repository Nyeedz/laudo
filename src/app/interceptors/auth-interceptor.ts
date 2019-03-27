import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { Injectable, NgModule } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class HttpsRequestInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    let cloneRequest = req;

    if (cloneRequest.url.includes("viacep")) {
      return next.handle(cloneRequest);
    }
    if (user && user.jwt && typeof user === "object") {
      if (user.jwt) {
        cloneRequest = req.clone({
          headers: req.headers.set("Authorization", `Bearer ${user.jwt}`)
        });
      }
    }

    return next.handle(cloneRequest);
  }
}

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpsRequestInterceptor,
      multi: true
    }
  ]
})
export class AuthInterceptor {}
