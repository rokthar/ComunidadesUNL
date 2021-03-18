import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Actividades } from 'src/app/core/model/actividades';
import { ActividadesService } from 'src/app/services/actividaes.service';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
    selector: 'validar-actividades',
    templateUrl: './validar-actividades.component.html',
    styleUrls: ['./validar-actividades.component.css']
})

export class validarActividadesComponent implements OnInit{
    titulo;
    private params;
    actividades;
    lista=[];
    estaLogeado:Boolean=false;
    hayDatos=false;
    imageSource: any;
    displayModal: boolean;
    constructor(
        private actividades_service:ActividadesService,
        private _location:Location,
        private sanitizer: DomSanitizer

    ){
        this.titulo="Lista de Actividades"
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

        this.actividades_service.listarPlanificacion().subscribe((resp:any)=>{
            this.lista = resp;
            for(let j in this.lista){
            this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'+this.lista[j].logo_comunidad);
            resp[j].logo_comunidad = this.imageSource;
            }
            console.log(this.lista);

            if(this.lista != null){
                this.hayDatos=true;
            }
        });
    }

    aceptarActividades(external_actividades){
        console.log(external_actividades);
        this.actividades_service.aceptarActividades(external_actividades).subscribe((resp:any)=>{
            console.log(resp);
            if(resp.siglas == "OE"){
                alert("Operación Exitosa");
                window.location.reload();
            }else{
                alert("Error al Enviar");
            }   
        });
    }

    rechazarActividades(external_actividades){
        console.log(external_actividades);
        this.actividades_service.rechazarActividades(external_actividades).subscribe((resp:any)=>{
            console.log(resp);
            if(resp.siglas == "OE"){
                alert("La planificación ha sido Rechazada");
                window.location.reload();
            }else{
                alert("Error al Enviar");
            }   
        });
    }

    verDetalles(external_actividades){
        this.displayModal=true
        for(let i in this.lista){
            if(this.lista[i].external_actividades == external_actividades){
                this.actividades = this.lista[i].actividades;
                console.log(this.actividades);
            }
        }
    }
}
