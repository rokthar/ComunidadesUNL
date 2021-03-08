import { NgModule } from '@angular/core';
import { PrimeNgModule } from 'src/app/prime-ng.module';

import { RouterModule } from '@angular/router';
import { PrivateRoutingModule } from './private-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrarComunidadComponent } from './docente/registrar-comunidad/registrar-comunidad.component';
import { PostulacionComponent } from './estudiante/postulacion/postulacion.component';
import { ValidarComunidadComponent } from './gestor/validar-comunidad/validar-comunidad.component';
import { VerificarInformacionComponent } from './secretaria/verificar-informacion/verificar-informacion.component';
import { AceptarPostulacionComponent } from './tutor/aceptar-postulacion/aceptar-postulacion.component';
import { AceptarComunidadComponent } from './decano/aceptar-comunidad/aceptar-comunidad.component';
//import { planificarActividadesComponent } from './tutor/planificar-actividades/planificar-actividaes.component';

@NgModule({
  declarations: [
    RegistrarComunidadComponent,
    PostulacionComponent,
    ValidarComunidadComponent,
    VerificarInformacionComponent,
    AceptarPostulacionComponent,
    AceptarComunidadComponent,
    //planificarActividadesComponent
  ],
  exports:[
  ],
  imports: [
    RouterModule,
    PrivateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule
  ],
  providers: []
})
export class PrivateModule { }
