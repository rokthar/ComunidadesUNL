import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { Comunidad } from 'src/app/core/model/comunidad';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { URL } from '../../../../core/constants/url';

@Component({
    selector: 'verificarinformacion',
    templateUrl: './verificar-informacion.component.html',
    styleUrls: ['./verificar-informacion.component.css'],
    providers: [MessageService]

})

export class VerificarInformacionComponent implements OnInit{
    rechazarComunidadForm: FormGroup;
    titulo:String;
    lista:Comunidad;
    params;
    estaLogeado:Boolean=false;
    hayDatos:boolean;
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
        this.titulo="Lista de Comunidades";
        this.rechazarComunidadForm = this._builder.group({
            comentario: ['']
          })
    }
    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if(this.params != null && this.params.tipo_docente=="3"){
            this.estaLogeado = true;
        }else{
            this._location.back();
        }
        this.comunidad_service.listarComunidadesEspera().subscribe((resp:Comunidad)=>{
            this.lista = resp;
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
        this.displayModal = false
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Cargando', detail: 'Se esta ejecutando la acción.' });

        const values = this.rechazarComunidadForm.getRawValue();
        this.comunidad_service.revisionInformacion(values,external_comunidad).subscribe((resp:any)=>{
            if(resp.siglas=="OE"){
                this.messageService.add({ key: 'tc', severity: 'success', summary: 'Operación Exitosa', detail: 'La Verificación ha sido completada' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }else{
                this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: 'La Verificación no pudo completarse' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        });
    }

    rechazarInformacion(external_comunidad){
        this.displayModal = false
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Cargando', detail: 'Se esta ejecutando la acción.' });

        const values = this.rechazarComunidadForm.getRawValue();
        this.comunidad_service.rechazarComunidad(values,external_comunidad).subscribe((resp:any)=>{
            if(resp.siglas=="OE"){
                this.messageService.add({ key: 'tc', severity: 'success', summary: 'Operación Exitosa', detail: 'La Verificación ha sido rechazada' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }else{
                this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: 'La Verificación no pudo ser rechazada' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        });
    }
}