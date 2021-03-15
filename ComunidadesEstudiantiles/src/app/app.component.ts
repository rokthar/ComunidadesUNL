import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { calendarioEspaniol } from './core/constants/idiomas';
import { AccesoService } from './core/global-services/acceso.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'ComunidadesEstudiantiles';
  estaLogeado = false;
  es = calendarioEspaniol;
  constructor(
    private config: PrimeNGConfig,
    private acceso_service:AccesoService
  ){
    this.config.setTranslation(this.es);
    // this.estaLogeado = sessionStorage.getItem('datosUsuario')? true:false;
   
  }
  ngOnInit(): void {
    this.acceso_service.estaLogeado.subscribe(_datosUsuario=>{
      this.estaLogeado=_datosUsuario?true:false;
    });
  }
}
