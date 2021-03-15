import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActividadesService } from 'src/app/services/actividaes.service';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { ResultadosService } from 'src/app/services/resultados.service';

@Component({
    selector: 'generar-resultados',
    templateUrl: './generar-resultados.component.html',
    styleUrls: ['./generar-resultados.component.css']
})

export class GenerarResultadosComponent implements OnInit{

    titulo="";
    private params: any;
    resultados="";
    actividades;
    ext_det_act;
    imagenesResultado;
    generarResultadosForm:FormGroup;
    estaLogeado:Boolean=false;
    

    constructor(
        private _builder:FormBuilder,
        private actividad_service:ActividadesService,
        private comunidad_service:ComunidadService,
        private resultados_service:ResultadosService,
        private _location:Location
    ){
        this.titulo="Generar Resultados de Actividades";
        this.generarResultadosForm = this._builder.group({
            resumen_resultado:['',Validators.required],
            descripcion_resultado:['',Validators.required],
            fecha_fin:['',Validators.required]
        });
    }

    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if(this.params != null && this.params.tipo_docente=="5"){
            this.estaLogeado=true;
            this.ext_det_act = sessionStorage.getItem('datosActividad');
            console.log(this.ext_det_act);
            
        }else{
            alert("no estoy autorizado");
            this._location.back();
        }
    }

    enviar(){
        const values = this.generarResultadosForm.getRawValue();
        console.log(values);
        console.log(this.ext_det_act);
        console.log(this.imagenesResultado);
        this.resultados_service.registrarResultado(values,this.ext_det_act).subscribe((resp:any)=>{
            console.log(resp);
            for (let i = 0; i < this.imagenesResultado.length; i++) {
                let form = new FormData();
                form.append('file',this.imagenesResultado[i]);
                this.resultados_service.subirImagenes(form,resp.external_resultado).subscribe((respi:any)=>{
                    console.log(respi);
                    if(respi.siglas=="OE"){
                        alert("Operación Exitosa");
                        window.location.reload();
                    }else{
                        alert("Error al Aceptar");
                    }
                });
            }
            // window.location.reload();
        });
            
            
    }

    seleccionar(external_det_actividad){
        this.ext_det_act = external_det_actividad
    }

    fileEvent(fileInput: Event){
        this.imagenesResultado = (<HTMLInputElement>fileInput.target).files;
        console.log(this.imagenesResultado);
    }

    cancelar(){
        this._location.back();
    }

}