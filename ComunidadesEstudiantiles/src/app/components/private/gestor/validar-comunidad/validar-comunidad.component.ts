import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Rutas } from 'src/app/core/constants/rutas';
import { Comunidad } from 'src/app/core/model/comunidad';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { URL } from '../../../../core/constants/url';

@Component({
    selector: 'validarcomunidad',
    templateUrl: './validar-comunidad.component.html',
    styleUrls: ['./validar-comunidad.component.css'],
    providers: [MessageService]

})

export class ValidarComunidadComponent implements OnInit{
    rechazarComunidadForm: FormGroup;
    titulo:String;
    lista:Comunidad;
    estaLogeado:Boolean=false;
    params;
    hayDatos=false;
    imageSource: any;
    displayModal: boolean;
    comunidad="";
    imagen = URL._imgCom;
    constructor(
        private _builder: FormBuilder,
        private comunidad_service:ComunidadService,
        private _location:Location,
        private sanitizer: DomSanitizer,
        private messageService: MessageService


    ){
        this.titulo="Lista de Comunidades Revisadas por la Secretaria";
        this.rechazarComunidadForm = this._builder.group({
            comentario: ['']
          })
    }
    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if(this.params != null && this.params.tipo_docente=="2"){
            this.estaLogeado = true;
        }else{
            alert("no estoy autorizado");
            this._location.back();
        }
        this.comunidad_service.listarComunidadesRevisadas().subscribe((resp:Comunidad)=>{
            this.lista = resp;
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
        const values = this.rechazarComunidadForm.getRawValue();
        this.comunidad_service.validarComunidad(values,external_comunidad).subscribe((resp:any)=>{
            if(resp.siglas=="OE"){
                this.displayModal = false
                this.messageService.add({ key: 'tc', severity: 'success', summary: 'Operación Exitosa', detail: 'La Comunidad ha sido validada' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }else{
                this.displayModal = false
                this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: 'La Comunidad no pudo ser validada' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        });
    }

    rechazarComunidad(external_comunidad){
        const values = this.rechazarComunidadForm.getRawValue();
        this.comunidad_service.rechazarComunidad(values,external_comunidad).subscribe((resp:any)=>{
            console.log(resp); //revisar respuesta
            if(resp.siglas=="OE"){
                this.displayModal = false
                this.messageService.add({ key: 'tc', severity: 'success', summary: 'Operación Exitosa', detail: 'La Comunidad ha sido rechazada' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }else{
                this.displayModal = false
                this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: 'La Comunidad no pudo ser rechazada' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        });
    }
}