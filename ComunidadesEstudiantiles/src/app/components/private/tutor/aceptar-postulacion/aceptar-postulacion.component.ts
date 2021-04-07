import { Component, OnInit } from '@angular/core';
import { Postulacion } from 'src/app/core/model/postulacion';
import { PostulacionService } from 'src/app/services/postulacion.service';
import { Router } from '@angular/router';
import { Rutas } from 'src/app/core/constants/rutas';
import { Location } from '@angular/common';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Comunidad } from 'src/app/core/model/comunidad';

@Component({
    selector: 'aceptarpostulacion',
    templateUrl: './aceptar-postulacion.component.html',
    styleUrls: ['./aceptar-postulacion.component.css'],
    providers: [MessageService]

})

export class AceptarPostulacionComponent implements OnInit {
    titulo: String;
    habilidades;
    lista: {}[] = [];
    postulaciones;
    private params;
    estaLogeado: Boolean = false;
    hayDatos: boolean;
    postulacionForm: FormGroup;

    constructor(
        private _builder: FormBuilder,
        private postulacion_service: PostulacionService,
        public router: Router,
        private _location: Location,
        private comunidad_service: ComunidadService,
        private messageService: MessageService

    ) {
        this.titulo = "Lista de Postulaciones",
        this.postulacionForm = this._builder.group({
            comentario: ['']
          })
    }
    ngOnInit(): void {

        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if ((this.params != null) && (this.params.tipo_docente == "5")) {
            this.estaLogeado = true;
        } else {
            this._location.back();
        }
        console.log(this.params);
        this.comunidad_service.buscarComunidadByTutor(this.params.external_docente).subscribe((resp: Comunidad) => {
            this.postulacion_service.listarPostulaciones(resp.external_comunidad).subscribe((resp: Postulacion[]) => {
                this.postulaciones = resp;
                if (this.postulaciones != null) {
                    this.hayDatos = true;
                } else {
                    this.hayDatos = false;
                }
            });
        });

        console.log(this.lista);
    }

    aceptarPostulacion(external_postulacion) {
        const values = this.postulacionForm.getRawValue();
        this.postulacion_service.aceptarPostulacion(values,external_postulacion).subscribe((resp: any) => {
            if (resp.siglas == "OE") {
                this.postulacion_service.añadirMiembro(external_postulacion).subscribe(() => {
                    if (resp.siglas == "OE") {
                        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Operación Exitosa', detail: 'La Postulación ha sido aceptada' });
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    }
                });
            } else {
                this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Operación Exitosa', detail: 'Error al aceptar la Postulación' });
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
            }
        });
    }

    rechazarPostulacion(external_postulacion) {
        const values = this.postulacionForm.getRawValue();
        this.postulacion_service.rechazarPostulacion(values,external_postulacion).subscribe((resp: any) => {
            if (resp.siglas == "OE") {
                this.messageService.add({ key: 'tc', severity: 'success', summary: 'Operación Exitosa', detail: 'La Postulación ha sido rechazada' });
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
            } else {
                this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: 'La Postulación no pudo ser rechazada' });
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
            }
        });
    }
}