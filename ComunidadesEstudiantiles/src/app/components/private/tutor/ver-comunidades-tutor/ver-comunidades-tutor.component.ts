import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Rutas } from 'src/app/core/constants/rutas';
import { Comunidad } from 'src/app/core/model/comunidad';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { VinculacionService } from 'src/app/services/vinculacion.service';
import { URL } from '../../../../core/constants/url';

@Component({
    selector: 'ver-comunidades-tutor',
    templateUrl: './ver-comunidades-tutor.component.html',
    styleUrls: ['./ver-comunidades-tutor.component.css']
})

export class VerComunidadesTutorComponent implements OnInit{
    lista;
    imagen = URL._imgCom;
    params: any;
    estaLogeado: boolean;
    hayDatos:boolean;
    imageSource: any;
    displayModal: boolean;
    comunidad: any="";
    constructor(
        private comunidad_service:ComunidadService,
        private router:Router,
        private _location: Location,
        private sanitizer: DomSanitizer

    ){

    }
    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if((this.params != null) && (this.params.tipo_docente == "5") ){
            this.estaLogeado = true;
        }else{
            this._location.back();
        }
        this.comunidad_service.buscarComunidadByTutor(this.params.external_docente).subscribe((resp:any)=>{
            this.comunidad_service.listarComunidadesVinculacion(resp.external_comunidad).subscribe((resp)=>{
                this.lista=resp;
                if(this.lista != null){
                    this.hayDatos=true;
                }else{
                    this.hayDatos=false;
                }
            });
        });
    }

    seleccionar(external_comunidad){
        sessionStorage.setItem('datosComunidad',external_comunidad);
        this.router.navigateByUrl(Rutas.generarVinculacion);
    }

    verDetalles(external_comunidad){
        this.displayModal=true
        for(let i in this.lista){
            if(this.lista[i].external_comunidad == external_comunidad){
                this.comunidad = this.lista[i];
            }
        }
    }

}