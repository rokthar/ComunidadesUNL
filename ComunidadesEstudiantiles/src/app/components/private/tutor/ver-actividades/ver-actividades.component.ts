import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActividadesService } from 'src/app/services/actividaes.service';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { ResultadosService } from 'src/app/services/resultados.service';
import { Router } from '@angular/router';
import { Rutas } from 'src/app/core/constants/rutas';
import { Comunidad } from 'src/app/core/model/comunidad';
import { Actividades } from 'src/app/core/model/actividades';

@Component({
    selector: 'ver-actividades',
    templateUrl: './ver-actividades.component.html',
    styleUrls: ['./ver-actividades.component.css']
})

export class VerActividadesComponent implements OnInit{
    actividades;
    params;
    estaLogeado=false;
    ext_det_act;
    hayDatos:boolean;
    constructor(
        private actividad_service:ActividadesService,
        private comunidad_service:ComunidadService,
        private _location:Location,
        private router:Router
    ){

    }
    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if(this.params != null && this.params.tipo_docente=="5"){
            this.estaLogeado=true;
            this.comunidad_service.buscarComunidadByTutor(this.params.external_docente).subscribe((com:Comunidad)=>{
                this.actividad_service.actividadesGenerarResultados(com.external_comunidad).subscribe((act:Actividades)=>{
                    this.actividades = act;
                    if(this.actividades != null){
                        this.hayDatos = true;
                    }else{
                        this.hayDatos=false;
                    }
                });
            });
            
        }else{
            this._location.back();
        }
    }

    seleccionar(external_det_actividad){
        sessionStorage.setItem('datosActividad',external_det_actividad);
        this.router.navigateByUrl(Rutas.generarResultados);

    }
}