import { Component, OnInit } from '@angular/core';
import { Comunidad } from 'src/app/core/model/comunidad';
import { ComunidadService } from 'src/app/services/comunidad.service';

@Component({
    selector: 'verificarinformacion',
    templateUrl: './verificar-informacion.component.html',
    styleUrls: ['./verificar-informacion.component.css']
})

export class VerificarInformacionComponent implements OnInit{
    titulo:String;
    lista:Comunidad;
    constructor(
        private comunidad_service:ComunidadService
    ){
        this.titulo="Lista de Comunidades"
    }
    ngOnInit(): void {
        this.comunidad_service.listarComunidadesEspera().subscribe((resp:Comunidad)=>{
            this.lista = resp;
            console.log(this.lista);
        });
    }

    verificarInformacion(external_comunidad){
        console.log(external_comunidad);
        this.comunidad_service.revisionInformacion(external_comunidad).subscribe((resp:any)=>{
            console.log(resp); //revisar respuesta
        });
    }
}