import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerResultadosComponent } from './components/public/ver-resultados/ver-resultados.component';

const routes: Routes = [
  {
    path: ``, loadChildren: () => import('./components/public/public.module').then(m => m.PublicModule),
  },
  {
    path: `admin`, loadChildren: () => import('./components/private/private.module').then(m => m.PrivateModule),
  },
  {
    path: `ver-resultado`, component:VerResultadosComponent
  }
]

@NgModule({
  imports: [ RouterModule.forRoot( routes, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}