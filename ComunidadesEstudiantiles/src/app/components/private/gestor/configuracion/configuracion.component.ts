import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Rutas } from 'src/app/core/constants/rutas';
import { ConfiguracionService } from 'src/app/services/configuracion.service';

@Component({
    selector: 'configuracion',
    templateUrl: './configuracion.component.html',
    styleUrls: ['./configuracion.component.css'],
    providers: [MessageService]
})

export class ConfiguracionComponent implements OnInit {
    configuracion: any = "";
    configuracionesForm: FormGroup;

    constructor(
        private conf_service: ConfiguracionService,
        private _builder: FormBuilder,
        private messageService: MessageService

    ) {
        this.configuracionesForm = this._builder.group({
            host: ['', Validators.required],
            correo: ['', Validators.required],
            clave: ['', Validators.required],
            repclave: ['', Validators.required],
            dias: ['', Validators.required]
        });
    }
    ngOnInit(): void {
        this.conf_service.configuraciones().subscribe((resp: any) => {
            this.configuracion = resp;
            console.log(this.configuracion);
        });
    }

    guardar() {
        const values = this.configuracionesForm.getRawValue();
        console.log(values);
        if (values.clave == values.repclave) {
            this.conf_service.editarMail(values).subscribe((resp: any) => {
                this.messageService.add({ key: 'tc', severity: 'success', summary: 'Configuración Guardada', detail: 'Las Configuraciones han sifo Guardadas Correctamente' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            });
        } else {
            this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error al Guardar', detail: 'Las Contraseñas no son iguales' });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    }

}