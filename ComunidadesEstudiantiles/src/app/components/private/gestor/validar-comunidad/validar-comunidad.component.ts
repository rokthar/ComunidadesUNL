import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
    estaLogeado:Boolean=false;
    params;
    hayDatos=false;
    imageSource: any;
    displayModal: boolean;
    comunidad="";
    constructor(
        private comunidad_service:ComunidadService,
        private _location:Location,
        private sanitizer: DomSanitizer

    ){
        this.titulo="Lista de Comunidades Revisadas por la Secretaria"
    }
    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if(this.params != null && this.params.tipo_docente=="2"){
            this.estaLogeado = true;
            console.log(this.params);
        }else{
            alert("no estoy autorizado");
            this._location.back();
        }
        this.comunidad_service.listarComunidadesRevisadas().subscribe((resp:Comunidad)=>{
            this.lista = resp;
            for(let i in this.lista){
                this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'+this.lista[i].ruta_logo);
                this.lista[i].ruta_logo = this.imageSource;
            }
            console.log(this.lista);
            if(this.lista!=null){
                this.hayDatos=true;
            }
        });
    }

    show(external_comunidad){
        this.displayModal=true
        for(let i in this.lista){
            if(this.lista[i].external_comunidad == external_comunidad){
                this.comunidad = this.lista[i];
            }
        }
    }

    validarComunidad(external_comunidad){
        console.log(external_comunidad);
        this.comunidad_service.validarComunidad(external_comunidad).subscribe((resp:any)=>{
            console.log(resp); //revisar respuesta
            if(resp.siglas=="OE"){
                alert("Operación Exitosa");
                this.displayModal=false
                window.location.reload();
            }else{
                alert("Error al Aceptar");
            }
        });
    }
}