import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PrimeNgModule } from 'src/app/prime-ng.module';

import { LoginComponent } from './login/login.component';
import { PublicRoutingModule } from './public-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  exports:[
  ],
  imports: [
    RouterModule,
    PublicRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule
  ],
  providers: []
})
export class PublicModule { }
