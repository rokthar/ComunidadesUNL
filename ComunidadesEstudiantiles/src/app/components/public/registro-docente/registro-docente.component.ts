import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {MessageService} from 'primeng/api';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
    selector: 'registro-docente',
    templateUrl: './registro-docente.component.html',
    styleUrls: ['./registro-docente.component.css'],
    providers: [MessageService]
})

export class RegistroDocenteComponent{
    correo=""; pass1=""; pass2=""; nombre=""; apellido="";
    selected="";
    tipoDoc = [
        {name: 'Gestor', value: 2},
        {name: 'Secretaria', value: 3},
        {name: 'Decano', value: 4},
        {name: 'Docente', value: 1}
    ];
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
                "tipo":1
            }
            let values = {
                nombres:this.nombre,
                apellidos:this.apellido,
                tipo_docente:this.selected['value']
            }
            console.log(user);
            
            this.usuario_service.registrarUsuario(user).subscribe((resp:any)=>{
                if(resp.siglas == "OE"){
                    this.usuario_service.registrarDocente(values,resp.external_us).subscribe((resp:any)=>{
                        if (resp.siglas == "OE") {
                            this.messageService.add({key: 'tc', severity:'success', summary: 'Operación Exitosa', detail: 'Su usuario ha sido registrado correctamente'});
                            setTimeout(() => {
                                this._location.back();
                            }, 1000);
                        }else{
                            this.messageService.add({key: 'tc', severity:'error', summary: 'Error al registrarse', detail: 'Ha ocurrido un error al registrar el usuario'}); 
                        }
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