import { Location } from '@angular/common';
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
    params: any;
    display: boolean;
    clave: {};
    estaLogeado:Boolean=false;
    constructor(
        private conf_service: ConfiguracionService,
        private messageService: MessageService,
        private _location:Location
    ) { }
    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));

        if ((this.params != null) && (this.params.estado == "1")) {
            this.estaLogeado = true;
          } else {
            // this._location.back();
          }
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
        if(this.host == "" || this.host == undefined || this.correo == "" || this.correo == undefined || this.dias == "" || this.dias == undefined){
            this.messageService.add({key: 'tc', severity:'warn', summary: 'Alerta', detail: 'Todos los campos son obligatorios.'});
            return;
        }
        this.messageService.add({key: 'tc', severity:'success', summary: 'Cargando', detail: 'Se esta ejecutando la acción.'});
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
        if(this.clave1 == "" || this.clave1 == undefined || this.clave2 == "" || this.clave2 == undefined){
            this.messageService.add({key: 'tc', severity:'warn', summary: 'Alerta', detail: 'Todos los campos son obligatorios.'});
            return;
        }
        if(this.clave1 == this.clave2){
            this.messageService.add({key: 'tc', severity:'success', summary: 'Cargando', detail: 'Se esta ejecutando la acción.'});
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