import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActividadesService } from 'src/app/services/actividaes.service';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { ResultadosService } from 'src/app/services/resultados.service';
import { URL } from '../../../../core/constants/url';

@Component({
    selector: 'visualizar-resultados',
    templateUrl: './visualizar-resultados.component.html',
    styleUrls: ['./visualizar-resultados.component.css']
})

export class VisualizarResultadosComponent implements OnInit{
    external_resultado:string;
    resultado=null;
    imageSource: any;
    imagen = URL._imgResul;
    imagen_com = URL._imgCom;
    constructor(
        private _location:Location,
        private resultados_service:ResultadosService,
        private sanitizer: DomSanitizer

    ){

    }
    ngOnInit(): void {
        this.external_resultado = sessionStorage.getItem('datosResultado');
        if(this.external_resultado != null){
            this.resultados_service.listarResultado(this.external_resultado).subscribe((resp:any)=>{
                this.resultado = resp;
            });
        }else{
            this._location.back();
        }
    }

    regresar(){
        this._location.back();
    }
}