import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActividadesService } from 'src/app/services/actividaes.service';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { ResultadosService } from 'src/app/services/resultados.service';
import { MessageService } from 'primeng/api';
import { Resultados } from 'src/app/core/model/resultados';

@Component({
    selector: 'generar-resultados',
    templateUrl: './generar-resultados.component.html',
    styleUrls: ['./generar-resultados.component.css'],
    providers: [MessageService]
})

export class GenerarResultadosComponent implements OnInit {

    titulo = "";
    private params: any;
    resultados = "";
    actividades;
    ext_det_act;
    imagenesResultado;
    generarResultadosForm: FormGroup;
    estaLogeado: Boolean = false;
    img:boolean=true;
    constructor(
        private _builder: FormBuilder,
        private actividad_service: ActividadesService,
        private comunidad_service: ComunidadService,
        private resultados_service: ResultadosService,
        private _location: Location,
        private messageService: MessageService
    ) {
        this.titulo = "Generar Resultados de Actividades";
        this.generarResultadosForm = this._builder.group({
            resumen_resultado: ['', Validators.required],
            descripcion_resultado: ['', Validators.required],
            fecha_fin: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if (this.params != null && this.params.tipo_docente == "5") {
            this.estaLogeado = true;
            this.ext_det_act = sessionStorage.getItem('datosActividad');

        } else {
            this._location.back();
        }
    }

    enviar() {
        const values = this.generarResultadosForm.getRawValue();
        for (let i = 0; i < this.imagenesResultado.length; i++) {
            if ((this.imagenesResultado[0].size <= 2000000) && (this.imagenesResultado[0].type == "image/jpeg")
                || (this.imagenesResultado[0].type == "image/jpg") || (this.imagenesResultado[0].type == "image/png")) {
            } else {
                this.img=false;
            }
        }
        if(this.img == true){
            this.resultados_service.registrarResultado(values, this.ext_det_act).subscribe((resp: Resultados) => {
                for (let i = 0; i < this.imagenesResultado.length; i++) {
                    let form = new FormData();
                    form.append('file', this.imagenesResultado[i]);
                    this.resultados_service.subirImagenes(form, resp.external_resultado).subscribe((respi: any) => {
                        if (respi.siglas == "OE") {
                            this.messageService.add({ key: 'tc', severity: 'success', summary: 'Operación Exitosa', detail: 'El Resultado ha sido publicado' });
                            setTimeout(() => {
                                this._location.back();
                            }, 1500);
                            
                        } else {
                            this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: 'Error al publicar el resultado' });
                            setTimeout(() => {
                                window.location.reload();
                            }, 1500);
                        }
                    });
                }
            });
        }else{
            this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error Imagen', detail: 'Su imagen no es del tipo especificado o pesa mas de 2Mb' });
        }

    }

    seleccionar(external_det_actividad) {
        this.ext_det_act = external_det_actividad
    }

    fileEvent(fileInput: Event) {
        this.imagenesResultado = (<HTMLInputElement>fileInput.target).files;

        for (let i = 0; i < this.imagenesResultado.length; i++) {
            if ((this.imagenesResultado[i].size <= 2000000) && (this.imagenesResultado[i].type == "image/jpeg")
                || (this.imagenesResultado[i].type == "image/jpg") || (this.imagenesResultado[i].type == "image/png")) {
            } else {
                this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error Imagen', detail: 'Su imagen no es del tipo especificado o pesa mas de 2Mb' });
                (<HTMLInputElement>fileInput.target).files = null;
            }

        }
    }

    cancelar() {
        this._location.back();
    }
}