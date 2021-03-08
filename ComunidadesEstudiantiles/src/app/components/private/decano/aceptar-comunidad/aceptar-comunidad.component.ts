import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Comunidad } from 'src/app/core/model/comunidad';
import { ComunidadService } from 'src/app/services/comunidad.service';

@Component({
    selector: 'aceptarcomuniddad',
    templateUrl: './aceptar-comunidad.component.html',
    styleUrls: ['./aceptar-comunidad.component.css']
})

export class AceptarComunidadComponent implements OnInit{
    titulo:String;
    lista:Comunidad;
    constructor(
        private comunidad_service:ComunidadService,
        public router:Router
    ){
        this.titulo="Lista de Comunidades Validadas por el Gestor"
    }

    ngOnInit(): void {
        this.comunidad_service.listarComunidadesValidadas().subscribe((resp:Comunidad)=>{
            this.lista = resp;
            console.log(this.lista);
        });
    }

    aceptarComunidad(external_comunidad){
        console.log(external_comunidad);
        this.comunidad_service.aceptarComunidad(external_comunidad).subscribe((resp:any)=>{
            console.log(resp); //revisar respuesta
        });
    }
}