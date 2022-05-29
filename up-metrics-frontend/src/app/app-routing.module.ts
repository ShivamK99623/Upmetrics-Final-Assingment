import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotComponent } from './mycomponent/forgot/forgot.component';
import { LoginComponent } from './mycomponent/login/login.component';
import { HomeComponent } from './mycomponent/home/home.component';
import { SignupComponent } from './mycomponent/signup/signup.component';
import { Router } from '@angular/router';
const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'forgot', component: ForgotComponent},
  {path: "home", component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private route:Router){
    if(localStorage.getItem("key")){
      this.route.navigate(["/"])
    }else{
      this.route.navigate(["/home"])

    }

  }
 }
