import { HttpClientModule } from "@angular/common/http";
import { NgModule, LOCALE_ID } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatStepperModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CompareValidatorDirective } from './shared/compare-validator.directive';

import { registerLocaleData } from "@angular/common";
import ptBr from "@angular/common/locales/pt";
registerLocaleData(ptBr);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    CompareValidatorDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AuthInterceptor,
    // material imports
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatButtonModule,
    MatStepperModule,
    MatSnackBarModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: "pt-PT" }],
  bootstrap: [AppComponent]
})
export class AppModule {}
