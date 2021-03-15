import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../public/login/login.component';
import { AceptarComunidadComponent } from './decano/aceptar-comunidad/aceptar-comunidad.component';
import { RegistrarComunidadComponent } from './docente/registrar-comunidad/registrar-comunidad.component';
import { PostulacionComponent } from './estudiante/postulacion/postulacion.component';
import { ValidarComunidadComponent } from './gestor/validar-comunidad/validar-comunidad.component';
import { VerificarInformacionComponent } from './secretaria/verificar-informacion/verificar-informacion.component';
import { AceptarPostulacionComponent } from './tutor/aceptar-postulacion/aceptar-postulacion.component';
import { planificarActividadesComponent } from './tutor/planificar-actividades/planificar-actividades.component';
import {validarActividadesComponent } from './gestor/validar-actividades/validar-actividades.component';
import { GenerarVinculacionComponent } from './tutor/generar-vinculacion/generar-vinculacion.component';
import { AceptarVinculacionComponent } from './tutor/aceptar-vinculacion/aceptar-vinculacion.component';
import { GenerarResultadosComponent } from './tutor/generar-resultados/generar-resultados.component';
import { PerfilMiembrosComponent } from './miembros/main-miembros/main-miembros.component';
import { MenuPrivateComponent } from '../../menu-private/menu-private.component';
import { VerComunidadesComponent } from './estudiante/ver-comunidades/ver-comunidades.component';
import { VerComunidadesTutorComponent } from './tutor/ver-comunidades-tutor/ver-comunidades-tutor.component';
import { VerActividadesComponent } from './tutor/ver-actividades/ver-actividades.component';
import { ReporteActividadesComponent } from './tutor/reporte-actividades/reporte-actividades.component';
import { VisualizarResultadosComponent } from './miembros/visualizar-resultados/visualizar-resultados.component';

const routes: Routes = [
  {path:'docente/registrar-comunidad',component: RegistrarComunidadComponent},
  {path:'estudiante/postulacion', component:PostulacionComponent},
  {path:'gestor/validar-comunidad',component:ValidarComunidadComponent},
  {path:'secretaria/verificar-informacion',component:VerificarInformacionComponent},
  {path:'tutor/aceptar-postulacion',component:AceptarPostulacionComponent},
  {path:'decano/aceptar-comunidad',component:AceptarComunidadComponent},
  {path:'tutor/planificar-actividades',component:planificarActividadesComponent},
  {path:'gestor/validar-actividades',component:validarActividadesComponent},
  {path:'tutor/generar-vinculacion',component:GenerarVinculacionComponent},
  {path:'tutor/aceptar-vinculacion',component:AceptarVinculacionComponent},
  {path:'tutor/generar-resultados',component:GenerarResultadosComponent},
  {path:'miembro/perfil',component:PerfilMiembrosComponent},
  {path:'estudiante/ver-comunidades',component:VerComunidadesComponent},
  {path:'tutor/ver-comunidades-tutor',component:VerComunidadesTutorComponent},
  {path:'tutor/ver-actividades', component:VerActividadesComponent},
  {path:'tutor/reporte-actividades',component:ReporteActividadesComponent},
  {path:'miembro/visualizar-resultados', component:VisualizarResultadosComponent}

]

@NgModule({
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
})
export class PrivateRoutingModule {}
