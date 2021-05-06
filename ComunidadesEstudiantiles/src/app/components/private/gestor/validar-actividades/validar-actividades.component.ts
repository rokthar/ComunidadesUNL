import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Actividades } from 'src/app/core/model/actividades';
import { ActividadesService } from 'src/app/services/actividaes.service';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { URL } from '../../../../core/constants/url';

@Component({
    selector: 'validar-actividades',
    templateUrl: './validar-actividades.component.html',
    styleUrls: ['./validar-actividades.component.css'],
    providers: [MessageService]

})

export class validarActividadesComponent implements OnInit{
    titulo;
    private params;
    actividades=[];
    lista=[];
    ext_act;
    estaLogeado:Boolean=false;
    hayDatos=false;
    imageSource: any;
    displayModal: boolean;
    imagen = URL._imgCom;
    actividadesForm: FormGroup;

    constructor(
        private _builder: FormBuilder,
        private actividades_service:ActividadesService,
        private _location:Location,
        private messageService: MessageService

    ){
        this.titulo="Lista de Actividades",
        this.actividadesForm = this._builder.group({
            comentario: ['']
          })
    }
    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if(this.params != null && this.params.tipo_docente=="2"){
            this.estaLogeado = true;
        }else{
            this._location.back();
        }

        this.actividades_service.listarPlanificacion().subscribe((resp:any)=>{
            this.lista = resp;
            if(this.lista != null){
                this.hayDatos=true;
            }
        });
    }

    aceptarActividades(external_actividades){
        const values = this.actividadesForm.getRawValue();
        this.actividades_service.aceptarActividades(values,external_actividades).subscribe((resp:any)=>{
            if(resp.siglas == "OE"){
                this.displayModal = false
                this.messageService.add({ key: 'tc', severity: 'success', summary: 'Operación Exitosa', detail: 'Las actividades ha sido Validadas' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }else{
                this.displayModal = false
                this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: 'Las actividades no pudieron ser validadas' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }   
        });
    }

    rechazarActividades(external_actividades){
        const values = this.actividadesForm.getRawValue();
        this.actividades_service.rechazarActividades(values,external_actividades).subscribe((resp:any)=>{
            if(resp.siglas == "OE"){
                this.displayModal = false
                this.messageService.add({ key: 'tc', severity: 'success', summary: 'Operación Exitosa', detail: 'Las actividades han sido rechazadas' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }else{
                this.displayModal = false
                this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: 'Las actividades no pudieron ser rechazadas' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }   
        });
    }

    verDetalles(external_actividades){
        this.displayModal=true
        for(let i in this.lista){
            if(this.lista[i].external_actividades == external_actividades){
                this.actividades = this.lista[i].actividades;
                this.ext_act = this.lista[i].external_actividades;
            }
        }
    }
}
