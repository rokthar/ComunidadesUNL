import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Comunidad } from 'src/app/core/model/comunidad';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { URL } from '../../../../core/constants/url';

@Component({
    selector: 'aceptarcomuniddad',
    templateUrl: './aceptar-comunidad.component.html',
    styleUrls: ['./aceptar-comunidad.component.css'],
    providers: [MessageService]
})

export class AceptarComunidadComponent implements OnInit {
    rechazarComunidadForm: FormGroup;
    titulo: String;
    lista: Comunidad;
    estaLogeado: Boolean = false;
    params;
    hayDatos: boolean = false;
    imageSource: any;
    displayModal: boolean;
    comunidad = "";
    imagen = URL._imgCom;
    constructor(
        private _builder: FormBuilder,
        private comunidad_service: ComunidadService,
        public router: Router,
        private _location: Location,
        private messageService: MessageService
    ) {
        this.titulo = "Lista de Comunidades Validadas por el Gestor";
        this.rechazarComunidadForm = this._builder.group({
            comentario: ['']
          })
    }

    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if ((this.params != null) && (this.params.tipo_docente == "4")) {
            this.estaLogeado = true;
        } else {
            this._location.back();
        }
        this.comunidad_service.listarComunidadesValidadas().subscribe((resp: Comunidad) => {
            this.lista = resp;
            if (this.lista != null) {
                this.hayDatos = true;
            }
        });
    }

    show(external_comunidad) {
        this.displayModal = true
        for (let i in this.lista) {
            if (this.lista[i].external_comunidad == external_comunidad) {
                this.comunidad = this.lista[i];
            }
        }
    }

    aceptarComunidad(external_comunidad) {
        this.comunidad_service.aceptarComunidad(external_comunidad).subscribe((resp: any) => {
            if (resp.siglas == "OE") {
                this.displayModal = false
                this.messageService.add({ key: 'tc', severity: 'success', summary: 'Operación Exitosa', detail: 'Comunidad Aceptada correctamente' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
                
            } else {
                this.displayModal = false
                this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: 'La comunidad no ha podido ser aceptada' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        });
    }

    rechazarComunidad(external_comunidad) {
        const values = this.rechazarComunidadForm.getRawValue();
        this.comunidad_service.rechazarComunidad(values, external_comunidad).subscribe((resp: any) => {
            if (resp.siglas == "OE") {
                this.messageService.add({ key: 'tc', severity: 'success', summary: 'Operación Exitosa', detail: 'La comunidad ha sido rechazada' });
                setTimeout(() => {
                    this.displayModal = false
                    window.location.reload();
                }, 1500);
                this.displayModal = false
                window.location.reload();
            } else {
                this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: 'La comunidad no ha podido ser rechazada' });
                setTimeout(() => {
                    this.displayModal = false
                    window.location.reload();
                }, 1500);
            }
        });
    }
}