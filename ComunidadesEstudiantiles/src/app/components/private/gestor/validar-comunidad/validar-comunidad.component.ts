import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Rutas } from 'src/app/core/constants/rutas';
import { Comunidad } from 'src/app/core/model/comunidad';
import { ComunidadService } from 'src/app/services/comunidad.service';

@Component({
    selector: 'validarcomunidad',
    templateUrl: './validar-comunidad.component.html',
    styleUrls: ['./validar-comunidad.component.css']
})

export class ValidarComunidadComponent implements OnInit{
    titulo:String;
    lista:Comunidad;
    constructor(
        private comunidad_service:ComunidadService
    ){
        this.titulo="Lista de Comunidades Revisadas por la Secretaria"
    }
    ngOnInit(): void {
        this.comunidad_service.listarComunidadesRevisadas().subscribe((resp:Comunidad)=>{
            this.lista = resp;
            console.log(this.lista);
        });
    }

    validarComunidad(external_comunidad){
        console.log(external_comunidad);
        this.comunidad_service.validarComunidad(external_comunidad).subscribe((resp:any)=>{
            console.log(resp); //revisar respuesta
        });
    }
}