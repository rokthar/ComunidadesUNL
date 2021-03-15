import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
    params;
    estaLogeado:Boolean=false;
    hayDatos:boolean;
    imageSource: any;
    displayModal: boolean;
    comunidad="";
    constructor(
        private comunidad_service:ComunidadService,
        private _location:Location,
        private sanitizer: DomSanitizer

    ){
        this.titulo="Lista de Comunidades"
    }
    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if(this.params != null && this.params.tipo_docente=="3"){
            this.estaLogeado = true;
            console.log(this.params);
        }else{
            alert("no estoy autorizado");
            this._location.back();
        }
        this.comunidad_service.listarComunidadesEspera().subscribe((resp:Comunidad)=>{
            this.lista = resp;
            for(let i in this.lista){
                this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'+this.lista[i].ruta_logo);
                this.lista[i].ruta_logo = this.imageSource;
            }
            console.log(this.lista);
            if(resp != null){
                this.hayDatos=true;
            }else{
                this.hayDatos=false;
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

    verificarInformacion(external_comunidad){
        console.log(external_comunidad);
        this.comunidad_service.revisionInformacion(external_comunidad).subscribe((resp:any)=>{
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