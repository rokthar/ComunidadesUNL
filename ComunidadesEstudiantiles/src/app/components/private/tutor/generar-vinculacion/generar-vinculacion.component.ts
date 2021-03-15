import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comunidad } from 'src/app/core/model/comunidad';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { VinculacionService } from 'src/app/services/vinculacion.service';

@Component({
    selector: 'generar-vinculacion',
    templateUrl: './generar-vinculacion.component.html',
    styleUrls: ['./generar-vinculacion.component.css']
})

export class GenerarVinculacionComponent implements OnInit{
    private params;
    titulo;
    private external_comunidad;
    generarVinculacionForm:FormGroup;
    lista:Comunidad;
    constructor(
        private _builder:FormBuilder,
        private vinculacion_service:VinculacionService,
        private comunidad_service:ComunidadService,
        private _location:Location
    ){
        this.generarVinculacionForm = this._builder.group({
            descripcion:['', Validators.required],
            fecha_inicio:['',Validators.required]
        })
    }

    ngOnInit(): void {
        this.external_comunidad = sessionStorage.getItem('datosComunidad');
        console.log(this.external_comunidad);
        this.titulo="Generar una Vinculación";
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        console.log(this.params);
        if(this.params != null && this.params.tipo_docente=="5"){

        }else{
            alert("no estoy autorizado");
            this._location.back();
        }
        this.comunidad_service.listarComunidades().subscribe((resp)=>{
            console.log(resp);
            this.lista=resp;
        });
    }

    seleccionaromunidad(ext_comunidad){
        this.external_comunidad = ext_comunidad;
        console.log(this.external_comunidad);
    }

    enviar(){
        const values = this.generarVinculacionForm.getRawValue();
        console.log(values);
        this.comunidad_service.buscarComunidadByTutor(this.params.external_docente).subscribe((resp:any)=>{
            console.log(resp);
            this.vinculacion_service.registrarVinculacion(resp.external_comunidad, this.external_comunidad,values).subscribe((respu:any)=>{
                console.log(respu);
                if(respu.siglas=="OE"){
                    alert("Operación Exitosa");
                    window.location.reload();
                }else{
                    alert("Error al Aceptar");
                }
            });
        });
        
    }

    cancelar(){
        console.log("Esto siendo funado");
        this._location.back();
    }
}