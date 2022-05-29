import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './mycomponent/navbar/navbar.component';
import { LoginComponent } from './mycomponent/login/login.component';
import { SignupComponent } from './mycomponent/signup/signup.component';
import { ForgotComponent } from './mycomponent/forgot/forgot.component';

import { HttpClientModule } from "@angular/common/http";
import { HomeComponent } from './mycomponent/home/home.component'
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    ForgotComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
