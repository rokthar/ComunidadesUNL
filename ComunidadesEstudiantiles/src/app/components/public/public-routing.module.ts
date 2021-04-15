import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { RecuperarClaveComponent } from './recuperar-clave/recuperar-clave.component';
import { RegistroComponent } from './registro/registro.component';
import { VerResultadosComponent } from './ver-resultados/ver-resultados.component';

const routes: Routes = [
  {path:'',component: MainComponent},
  {path:'login',component:LoginComponent},
  {path: 'ver-resultados', component:VerResultadosComponent},
  {path:'recuperar-clave',component:RecuperarClaveComponent},
  {path:'registro',component:RegistroComponent}
]

@NgModule({
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
})
export class PublicRoutingModule {}
