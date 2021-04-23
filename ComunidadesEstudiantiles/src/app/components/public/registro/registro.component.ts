import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Rutas } from 'src/app/core/constants/rutas';
import {MessageService} from 'primeng/api';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
    selector: 'registro',
    templateUrl: './registro.component.html',
    styleUrls: ['./registro.component.css'],
    providers: [MessageService]
})

export class RegistroComponent{

    correo=""; pass1=""; pass2=""; nombre=""; apellido=""; ciclo=""; paralelo="";

    constructor(
        private _location:Location,
        private messageService: MessageService,
        private usuario_service:UsuarioService
    ){}
    registrarse(){
        if(this.pass1 == this.pass2){
            let user = {
                "correo":this.correo,
                "clave":this.pass1,
                "tipo":2
            }
            let estudiante ={
                "nombres":this.nombre,
                "apellidos":this.apellido,
                "ciclo":this.ciclo,
                "paralelo":this.paralelo
            }
            this.usuario_service.registrarUsuario(user).subscribe((resp:any)=>{
                if(resp.siglas == "OE"){
                    this.usuario_service.registrarEstudiante(estudiante,resp.external_us).subscribe((resp:any)=>{
                        this.messageService.add({key: 'tc', severity:'success', summary: 'Operación Exitosa', detail: 'Su usuario ha sido registrado correctamente'});
                        setTimeout(() => {
                            this._location.back();
                        }, 1000);
                    });
                }else{
                    this.messageService.add({key: 'tc', severity:'error', summary: 'Error al registrarse', detail: 'Ha ocurrido un error al registrar el usuario'}); 
                }
            });
        }else{
            this.messageService.add({key: 'tc', severity:'error', summary: 'Error al registrarse', detail: 'Las Contraseñas no coinciden'});
        }
    }
    cancelar(){
        this._location.back();
    }

}