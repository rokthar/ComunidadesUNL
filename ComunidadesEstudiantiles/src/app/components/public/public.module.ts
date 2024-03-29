import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PrimeNgModule } from 'src/app/prime-ng.module';


import { LoginComponent } from './login/login.component';
import { PublicRoutingModule } from './public-routing.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './main/main.component';
import { ResultadosPreviewComponent } from './resultados-preview/resultados-preview.component';
import { VerResultadosComponent } from './ver-resultados/ver-resultados.component';
import { RecuperarClaveComponent } from './recuperar-clave/recuperar-clave.component';
import { RegistroComponent } from './registro/registro.component';
import { RegistroDocenteComponent } from './registro-docente/registro-docente.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    LoginComponent,
    MainComponent,
    ResultadosPreviewComponent,
    VerResultadosComponent,
    RecuperarClaveComponent,
    RegistroComponent,
    RegistroDocenteComponent,
    FooterComponent
  ],
  exports:[
  ],
  imports: [
    RouterModule,
    PublicRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    CommonModule
  ],
  providers: []
})
export class PublicModule { }
