import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActividadesService } from 'src/app/services/actividaes.service';
import { ComunidadService } from 'src/app/services/comunidad.service';
declare var $: any;

@Component({
    selector: 'planificar-actividades',
    templateUrl: './planificar-actividades.component.html',
    styleUrls: ['./planificar-actividades.component.css'],
    providers: [MessageService]

})

export class planificarActividadesComponent implements OnInit {

    titulo = "";
    logo_comunidad = "";
    private params: any;
    planificarActividadesForm: FormGroup;
    ocultar = "ocultar";
    hayDatos: boolean = false;
    listaActividades;

    constructor(
        private _builder: FormBuilder,
        private actividades_service: ActividadesService,
        private comunidad_service: ComunidadService,
        private _location: Location,
        private messageService: MessageService

    ) {
        this.titulo = "Planificación de Actividades";
        this.planificarActividadesForm = _builder.group({
            actividades: _builder.array([_builder.group({ nombre_actividad: [''], descripcion_actividad: [''], fecha_inicio: [''] })])
        });
    }

    ngOnInit(): void {

        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if (this.params != null && this.params.tipo_docente == "5") {
            this.comunidad_service.buscarComunidadByTutor(this.params.external_docente).subscribe((resp: any) => {
                this.logo_comunidad = resp.ruta_logo;
                this.actividades_service.listarPlanificacionByComunidad(resp.external_comunidad).subscribe((lista: any) => {
                    if (lista != null) {
                        this.listaActividades = lista;
                        this.hayDatos = true;
                    }
                });
            });
        } else {
            this._location.back();
        }

    }

    get getActividades() {
        return this.planificarActividadesForm.get('actividades') as FormArray;
    }

    add() {
        const control = <FormArray>this.planificarActividadesForm.controls['actividades'];
        control.push(this._builder.group({ nombre_actividad: [''], descripcion_actividad: [''], fecha_inicio: [] }));
    }
    less(index) {
        const control = <FormArray>this.planificarActividadesForm.controls['actividades'];
        control.removeAt(index);
    }

    enviar() {
        const values = this.planificarActividadesForm.getRawValue();
        this.actividades_service.registrarActividades(this.params.external_docente).subscribe((resp: any) => {
            this.actividades_service.registrarDetallesActividades(values.actividades, resp['external_actividades']).subscribe((respu: any) => {
                if (respu.siglas == "OE") {
                    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Operación Exitosa', detail: 'La Planificación ha sido generada correctamente' });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Operación Exitosa', detail: 'La Planificaión no pudo ser generada' });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                }
            });
        });
    }

    cancelar() {
        this.planificarActividadesForm.reset();
    }



}