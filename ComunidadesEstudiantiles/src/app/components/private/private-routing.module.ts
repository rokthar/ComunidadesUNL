import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../public/login/login.component';
import { AceptarComunidadComponent } from './decano/aceptar-comunidad/aceptar-comunidad.component';
import { RegistrarComunidadComponent } from './docente/registrar-comunidad/registrar-comunidad.component';
import { PostulacionComponent } from './estudiante/postulacion/postulacion.component';
import { ValidarComunidadComponent } from './gestor/validar-comunidad/validar-comunidad.component';
import { VerificarInformacionComponent } from './secretaria/verificar-informacion/verificar-informacion.component';
import { AceptarPostulacionComponent } from './tutor/aceptar-postulacion/aceptar-postulacion.component';
//import { planificarActividadesComponent } from './tutor/planificar-actividades/planificar-actividaes.component';

const routes: Routes = [
  {path:'docente/registrar-comunidad',component: RegistrarComunidadComponent},
  {path:'estudiante/postulacion', component:PostulacionComponent},
  {path:'gestor/validar-comunidad',component:ValidarComunidadComponent},
  {path:'secretaria/verificar-informacion',component:VerificarInformacionComponent},
  {path:'tutor/aceptar-postulacion',component:AceptarPostulacionComponent},
  {path:'decano/aceptar-comunidad',component:AceptarComunidadComponent},
  //{path:'tutor/planificar-actividades',component:planificarActividadesComponent}
]

@NgModule({
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
})
export class PrivateRoutingModule {}
