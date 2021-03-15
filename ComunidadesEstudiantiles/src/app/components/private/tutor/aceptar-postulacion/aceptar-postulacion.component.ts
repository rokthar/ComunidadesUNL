import { Component, OnInit } from '@angular/core';
import { Postulacion } from 'src/app/core/model/postulacion';
import { PostulacionService } from 'src/app/services/postulacion.service';
import { Router } from '@angular/router';
import { Rutas } from 'src/app/core/constants/rutas';
import { Location } from '@angular/common';
import { ComunidadService } from 'src/app/services/comunidad.service';

@Component({
    selector: 'aceptarpostulacion',
    templateUrl: './aceptar-postulacion.component.html',
    styleUrls: ['./aceptar-postulacion.component.css']
})

export class AceptarPostulacionComponent implements OnInit{
    titulo:String;
    habilidades;
    lista:{}[] = [];
    postulaciones;
    private params;
    estaLogeado:Boolean=false;
    hayDatos:boolean;
    constructor(
       private postulacion_service:PostulacionService,
       public router:Router,
       private _location: Location,
       private comunidad_service: ComunidadService
    ){
        this.titulo = "Lista de Postulaciones"
    }
    ngOnInit(): void {
        
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if((this.params != null) && (this.params.tipo_docente == "5") ){
            this.estaLogeado = true;
            console.log(this.params);
        }else{
            alert("no estoy autorizado");
            this._location.back();
        }
        console.log(this.params);
        this.comunidad_service.buscarComunidadByTutor(this.params.external_docente).subscribe((resp:any)=>{
            this.postulacion_service.listarPostulaciones(resp.external_comunidad).subscribe((resp:Postulacion[])=>{
                this.postulaciones = resp;
                console.log(this.postulaciones);
                if(this.postulaciones != null){
                    this.hayDatos=true;
                }else{
                    this.hayDatos=false;
                }
            });
        });
        
        console.log(this.lista);
    }

    aceptarPostulacion(external_postulacion){
        alert("Postulacion Aceptada");
        //console.log(external_comunidad);
        this.postulacion_service.aceptarPostulacion(external_postulacion).subscribe((resp:any)=>{
            console.log(resp); //revisar respuesta
            if(resp.siglas=="OE"){
                this.postulacion_service.añadirMiembro(external_postulacion).subscribe(()=>{
                    if(resp.siglas=="OE"){
                        alert("Operación Exitosa");
                        window.location.reload();
                    }
                });
            }else{
                alert("Error al Aceptar");
            }
        });
    }

    rechazarPostulacion(external_postulacion){
        console.log(external_postulacion);
        // this.postulacion_service.aceptarPostulacion(external_postulacion).subscribe((resp:any)=>{
        //     console.log(resp); //revisar respuesta
        // });
    }

    enviar(){
        console.log("enviado");
    }
}