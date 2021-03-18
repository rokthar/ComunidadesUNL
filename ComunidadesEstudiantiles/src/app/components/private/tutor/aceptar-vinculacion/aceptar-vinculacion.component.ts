import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comunidad } from 'src/app/core/model/comunidad';
import { Vinculacion } from 'src/app/core/model/vinculacion';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { VinculacionService } from 'src/app/services/vinculacion.service';

@Component({
    selector: 'aceptar-vinculacion',
    templateUrl: './aceptar-vinculacion.component.html',
    styleUrls: ['./aceptar-vinculacion.component.css']
})

export class AceptarVinculacionComponent implements OnInit{
    titulo;
    public params;
    lista:Vinculacion;
    estaLogeado:Boolean=false;
    hayDatos: boolean=false;
    constructor(
        private vinculacion_service:VinculacionService,
        private comunidad_service:ComunidadService,
        private _location:Location
    ){
        this.titulo="Aceptar Vinculacion";
    }
    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if(this.params != null && this.params.tipo_docente=="5"){
            this.estaLogeado = true;
            console.log(this.params);
        }else{
            alert("no estoy autorizado");
            this._location.back();
        }

       this.comunidad_service.buscarComunidadByTutor(this.params.external_docente).subscribe((comunidad:Comunidad)=>{
           console.log(comunidad);
        this.vinculacion_service.listarVinculacionComunidad(comunidad.external_comunidad).subscribe((resp:any)=>{
            console.log(resp);
            this.lista=resp;
            if(this.lista != null){
                this.hayDatos = true;
            }
        });
       });
        
    }

    aceptarVinculacion(external_vinculacion){
        this.vinculacion_service.activarVinculacion(external_vinculacion).subscribe((resp:any)=>{
            if(resp.siglas=="OE"){
                alert("Operación Exitosa");
                window.location.reload();
            }else{
                alert("Error al Aceptar");
            }
        });
    }

    rechazarVinculacion(external_vinculacion){
        this.vinculacion_service.rechazarVinculación(external_vinculacion).subscribe((resp:any)=>{
            if(resp.siglas=="OE"){
                alert("La solicitud de Vinculación ha sido Rechazada");
                window.location.reload();
            }else{
                alert("Error al Aceptar");
            }
        });
    }

}