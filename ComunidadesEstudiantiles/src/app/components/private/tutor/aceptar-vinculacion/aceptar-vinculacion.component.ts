import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Comunidad } from 'src/app/core/model/comunidad';
import { Vinculacion } from 'src/app/core/model/vinculacion';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { VinculacionService } from 'src/app/services/vinculacion.service';
import { URL } from '../../../../core/constants/url';
@Component({
    selector: 'aceptar-vinculacion',
    templateUrl: './aceptar-vinculacion.component.html',
    styleUrls: ['./aceptar-vinculacion.component.css'],
    providers: [MessageService]

})

export class AceptarVinculacionComponent implements OnInit{
    rechazarVinculacionForm: FormGroup;
    imagen = URL._imgCom;
    titulo; descrip; external_vinculacion;
    public params;
    lista:Vinculacion;
    estaLogeado:Boolean=false;
    hayDatos: boolean=false;
    displayModal:boolean;
    constructor(
        private _builder: FormBuilder,
        private vinculacion_service:VinculacionService,
        private comunidad_service:ComunidadService,
        private _location:Location,
        private messageService: MessageService

    ){
        this.titulo="Aceptar Vinculacion";
        this.rechazarVinculacionForm = this._builder.group({
            comentario: ['']
          })
    }
    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if(this.params != null && this.params.tipo_docente=="5"){
            this.estaLogeado = true;
        }else{
            this._location.back();
        }

       this.comunidad_service.buscarComunidadByTutor(this.params.external_docente).subscribe((comunidad:Comunidad)=>{
        this.vinculacion_service.listarVinculacionComunidad(comunidad.external_comunidad).subscribe((resp:Vinculacion)=>{
            this.lista=resp;
            if(this.lista != null){
                this.hayDatos = true;
            }
        });
       });
        
    }

    aceptarVinculacion(external_vinculacion){
        const values = this.rechazarVinculacionForm.getRawValue();
        this.displayModal = false;
        this.vinculacion_service.activarVinculacion(values,external_vinculacion).subscribe((resp:any)=>{
            if(resp.siglas=="OE"){
                this.messageService.add({ key: 'tc', severity: 'success', summary: 'Operación Exitosa', detail: 'La Vinculación ha sido aceptada correctamente' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }else{
                this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: 'La Vinculación no pudo ser aceptada' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        });
    }

    rechazarVinculacion(external_vinculacion){
        this.displayModal = false;
        const values = this.rechazarVinculacionForm.getRawValue();
        this.vinculacion_service.rechazarVinculación(values,external_vinculacion).subscribe((resp:any)=>{
            if(resp.siglas=="OE"){
                this.messageService.add({ key: 'tc', severity: 'success', summary: 'Operación Exitosa', detail: 'La Vinculación ha sido rechazada correctamente' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }else{
                this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: 'La Vinculación no pudo ser rechazada' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        });
    }

    detalles(descripcion,external){
        this.descrip = descripcion;
        this.external_vinculacion = external;
        this.displayModal = true;
    }

}