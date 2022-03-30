import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { Alignment } from 'pdfmake/interfaces';
import { MessageService } from 'primeng/api';
import { Rutas } from 'src/app/core/constants/rutas';
import { Comunidad } from 'src/app/core/model/comunidad';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { UsuarioService } from 'src/app/services/usuario.service';
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
    comunidadPDF;
    constructor(
        private _builder: FormBuilder,
        private comunidad_service:ComunidadService,
        private _location:Location,
        private sanitizer: DomSanitizer,
        private messageService: MessageService,
        private usuario_service:UsuarioService

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
        this.displayModal = false;
        this.messageService.add({key: 'tc', severity:'success', summary: 'Cargando', detail: 'Se esta ejecutando la acción.'});
        const values = this.rechazarComunidadForm.getRawValue();
        this.comunidad_service.validarComunidad(values,external_comunidad).subscribe((resp:any)=>{
            if(resp.siglas=="OE"){
                this.generarPDF(external_comunidad);
                this.messageService.add({ key: 'tc', severity: 'success', summary: 'Operación Exitosa', detail: 'La Comunidad ha sido validada' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }else{
                this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: 'La Comunidad no pudo ser validada' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        });
    }

    rechazarComunidad(external_comunidad){
        this.displayModal = false;
        this.messageService.add({key: 'tc', severity:'success', summary: 'Cargando', detail: 'Se esta ejecutando la acción.'});

        const values = this.rechazarComunidadForm.getRawValue();
        this.comunidad_service.rechazarComunidad(values,external_comunidad).subscribe((resp:any)=>{
            if(resp.siglas=="OE"){
                this.messageService.add({ key: 'tc', severity: 'success', summary: 'Operación Exitosa', detail: 'La Comunidad ha sido rechazada' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }else{
                this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: 'La Comunidad no pudo ser rechazada' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        });
    }

    generarPDF(external_comunidad) {
        this.comunidad_service.buscarComunidad(external_comunidad).subscribe((resp:any)=>{
            this.comunidadPDF = resp;
            let docDefinition = {
                content: [
                    {
                        image: 'data:image/png;base64,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',
                        style: 'imagenes'
                    },
                    {
                        text: '\nUNIVERSIDAD NACIONAL DE LOJA',
                        style: 'header'
                    },
                    {
                        text: [
                            { text: 'FACULTAD DE LAS ENERGÍAS, LAS INDUSTRIAS Y LOS RECURSOS NATURALES NO RENOVABLES\n' },
                            { text: 'INGENIERÍA EN SISTEMAS\n\n\n' }
                        ],
                        style: 'subheader'
                    },
                    {
                        text: [
                            { text: '\nComunidad: ', bold: true }, this.comunidadPDF.nombre_comunidad + '\n',
                            { text: 'Tutor: ', bold: true }, this.comunidadPDF.tutor + '\n\n\n'
                        ],
                        style: 'texto'
                    },
                    {
                        text: 'SOLICITUD DE CREACIÓN DE COMUNIDAD ESTIDIANTIL\n\n',
                        style: 'titulos'
                    },
                    {
                        text: '\n\nDescripción de la Comunidad\n\n',
                        style: 'subtitulos'
                    },
                    {
                        text: this.comunidadPDF.descripcion,
                        style: 'texto'
                    },
                    {
                        text: '\n\Misión de la Comunidad\n\n',
                        style: 'subtitulos'
                    },
                    {
                        text: this.comunidadPDF.mision,
                        style: 'texto'
                    },
                    {
                        text: '\n\Visión de la Comunidad\n\n',
                        style: 'subtitulos'
                    },
                    {
                        text: this.comunidadPDF.vision,
                        style: 'texto'
                    },
                    {
                        text: [
                            { text: '\n\n\n\n_______________________________________________\n' },
                            { text: 'Roger Francisco\n' },
                            { text: 'Decano de la Carrera\n' }
                        ],
                        style: 'firmas'
                    }
    
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        alignment: 'center' as Alignment
                    },
                    subheader: {
                        fontSize: 10,
                        bold: true,
                        alignment: 'center' as Alignment
                    },
                    texto: {
                        fontSize: 12,
                        alignment: 'justify' as Alignment
                    },
                    firmas: {
                        alignment: 'center' as Alignment
                    },
                    titulos: {
                        fontSize: 12,
                        bold: true,
                        alignment: 'center' as Alignment
                    },
                    subtitulos: {
                        fontSize: 12,
                        bold: true,
                        alignment: 'justify' as Alignment
                    },
                    tablasTexto: {
                        color: '#fafafa'
                    },
                    imagenes: {
                        alignment: 'center' as Alignment
                    }
                }
            };
    
            // pdfMake.createPdf(docDefinition).open();
            const pdfDocGenerator = pdfMake.createPdf(docDefinition);
            pdfDocGenerator.getBase64((data) => {
                this.usuario_service.enviarMail({"pdf":data}).subscribe((resp:any)=>{
                });
            });
        });
        
    }
}