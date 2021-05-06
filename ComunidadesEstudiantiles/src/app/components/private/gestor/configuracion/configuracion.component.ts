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
    host = ""; correo = ""; dias;clave1="";clave2="";
    values: {};
    display: boolean;
    clave: {};
    constructor(
        private conf_service: ConfiguracionService,
        private messageService: MessageService

    ) { }
    ngOnInit(): void {
        this.conf_service.configuraciones().subscribe((resp: any) => {
            this.host = resp.host;
            this.correo = resp.correo;
            this.dias = resp.dias;
        });
    }
    show() {
        this.display = true;
    }

    guardar() {
        this.values = {
            "host": this.host,
            "correo": this.correo,
            "dias": this.dias
        }
        this.conf_service.editarMail(this.values).subscribe((resp: any) => {
            if (resp.siglas = "OE") {
                this.messageService.add({ key: 'tc', severity: 'success', summary: 'Configuración Guardada', detail: 'Las Configuraciones han sido Guardadas Correctamente' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }else{
                this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error al Guardar', detail: 'Las Contraseñas no son iguales' });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
            }
        });
    }
    cambiarContrasena(){
        this.clave={
            "clave":this.clave1
        }
        if(this.clave1 == this.clave2){
            this.conf_service.editarClave(this.clave).subscribe((resp:any)=>{
                if(resp.siglas = "OE"){
                    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Configuración Guardada', detail: 'Su contraseña ha sido cambiada Correctamente' });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }else{
                    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error al Guardar', detail: 'La contraseña no ha podido ser guardada' });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            });
        }else{
            this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error al Guardar', detail: 'La contraseña no ha podido ser guardada' });
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
        this.display=false;
    }
}