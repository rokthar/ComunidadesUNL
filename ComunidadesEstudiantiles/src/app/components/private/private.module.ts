import { NgModule } from '@angular/core';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PrivateRoutingModule } from './private-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrarComunidadComponent } from './docente/registrar-comunidad/registrar-comunidad.component';
import { PostulacionComponent } from './estudiante/postulacion/postulacion.component';
import { ValidarComunidadComponent } from './gestor/validar-comunidad/validar-comunidad.component';
import { VerificarInformacionComponent } from './secretaria/verificar-informacion/verificar-informacion.component';
import { AceptarPostulacionComponent } from './tutor/aceptar-postulacion/aceptar-postulacion.component';
import { AceptarComunidadComponent } from './decano/aceptar-comunidad/aceptar-comunidad.component';
import { planificarActividadesComponent } from './tutor/planificar-actividades/planificar-actividades.component';
import { validarActividadesComponent } from './gestor/validar-actividades/validar-actividades.component';
import { GenerarVinculacionComponent } from './tutor/generar-vinculacion/generar-vinculacion.component';
import { AceptarVinculacionComponent } from './tutor/aceptar-vinculacion/aceptar-vinculacion.component';
import { GenerarResultadosComponent } from './tutor/generar-resultados/generar-resultados.component';
import { PerfilMiembrosComponent } from './miembros/main-miembros/main-miembros.component';
import { MenuTutorComponent } from './tutor/menu-tutor/menu-tutor.component';
import { MenuDecanoComponent } from './decano/menu-decano/menu-decano.component';
import { MenuDocenteComponent } from './docente/menu-docente/menu-docente.component';
import { MenuEstudianteComponent } from './estudiante/menu-estudiante/menu-estudiante.component';
import { MenuGestorComponent } from './gestor/menu-gestor/menu-gestor.component';
import { MenuMiembrosComponent } from './miembros/menu-miembros/menu-miembros.component';
import { MenuSecretariaComponent } from './secretaria/menu-secretaria/menu-secretaria.component';
import { VerComunidadesComponent } from './estudiante/ver-comunidades/ver-comunidades.component';
import { VerComunidadesTutorComponent } from './tutor/ver-comunidades-tutor/ver-comunidades-tutor.component';
import { VerActividadesComponent } from './tutor/ver-actividades/ver-actividades.component';
import { VisualizarResultadosComponent } from './miembros/visualizar-resultados/visualizar-resultados.component';
import { ConfiguracionComponent } from './gestor/configuracion/configuracion.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import { SideMenuTutorComponent } from './tutor/sidemenu-tutor/sidemenu-tutor.component';
import { SideMenuDecanoComponent } from './decano/sidemenu-decano/sidemenu-decano.component';
import { SideMenuEstudianteComponent } from './estudiante/sidemenu-estudiante/sidemenu-estudiante.component';
import { SideMenuGestorComponent } from './gestor/sidemenu-gestor/sidemenu-gestor.component';
import { SideMenuMiembrosComponent } from './miembros/sidemenu-miembros/sidemenu-miembros.component';
import { SideMenuSecretariaComponent } from './secretaria/sidemenu-secretaria/sidemenu-secretaria.component';
import { SideMenuDocenteComponent } from './docente/sidemenu-docente/sidemenu-docente.component';
import { EditarDecanoComponent } from './decano/editar-decano/editar-decano.component';
import { EditarDocenteComponent } from './docente/editar-docente/editar-docente.component';
import { EditarEstudianteComponent } from './estudiante/editar-estudiante/editar-estudiante.component';
import { EditarGestorComponent } from './gestor/editar-gestor/editar-gestor.component';
import { EditarMiembroComponent } from './miembros/editar-miembro/editar-miembro.component';
import { EditarSecretariaComponent } from './secretaria/editar-secretaria/editar-secretaria.component';
import { EditarTutorComponent } from './tutor/editar-tutor/editar-tutor.component';
import { EditarComunidadComponent } from './tutor/editar-comunidad/editar-comunidad.component';
import { GestionUsuariosComponent } from './gestor/gestion-usuarios/gestion-usuarios.component';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    RegistrarComunidadComponent,
    PostulacionComponent,
    ValidarComunidadComponent,
    VerificarInformacionComponent,
    AceptarPostulacionComponent,
    AceptarComunidadComponent,
    planificarActividadesComponent,
    validarActividadesComponent,
    GenerarVinculacionComponent,
    AceptarVinculacionComponent,
    GenerarResultadosComponent,
    PerfilMiembrosComponent,
    MenuTutorComponent,
    MenuDecanoComponent,
    MenuDocenteComponent,
    MenuEstudianteComponent,
    MenuGestorComponent,
    MenuMiembrosComponent,
    MenuSecretariaComponent,
    VerComunidadesComponent,
    VerComunidadesTutorComponent,
    VerActividadesComponent,
    VisualizarResultadosComponent,
    ConfiguracionComponent,
    SideMenuTutorComponent,
    SideMenuDecanoComponent,
    SideMenuEstudianteComponent,
    SideMenuGestorComponent,
    SideMenuMiembrosComponent,
    SideMenuSecretariaComponent,
    SideMenuDocenteComponent,
    EditarDecanoComponent,
    EditarDocenteComponent,
    EditarEstudianteComponent,
    EditarGestorComponent,
    EditarMiembroComponent,
    EditarSecretariaComponent,
    EditarTutorComponent,
    EditarComunidadComponent,
    GestionUsuariosComponent
  ],
  exports:[
  ],
  imports: [
    RouterModule,
    PrivateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    CommonModule,
    FullCalendarModule
  ],
  providers: []
})
export class PrivateModule { }
