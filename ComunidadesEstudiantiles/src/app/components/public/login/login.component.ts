import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { componentFactoryName } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Rutas } from 'src/app/core/constants/rutas';
import { AccesoService } from 'src/app/core/global-services/acceso.service';
import { Docente } from 'src/app/core/model/docente';
import { Estudiante } from 'src/app/core/model/estudiante';
import { Usuario } from 'src/app/core/model/usuario';
import { DocenteService } from 'src/app/services/docente.service';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import {MessageService} from 'primeng/api';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [MessageService]
})

export class LoginComponent {
    public titulo: string;
    public comentario: string;
    
    correo="";
    loginForm: FormGroup;
    display: boolean= false;
    constructor(
        private usuarioService:UsuarioService,
        private docenteService:DocenteService,
        private estudianteService:EstudianteService,
        private acceso_service:AccesoService,
        private _builder:FormBuilder,
        public router:Router,
        private _location:Location,
        private messageService: MessageService
    ){
        this.titulo="INGRESA AL SITIO WEB";
        this.comentario="COMUNIDADES ESTUDIANTILES";

        this.loginForm = this._builder.group({
            correo:['', Validators.compose([Validators.email, Validators.required])],
            clave:['', Validators.required]
        })

    }

    login(){
        const values = this.loginForm.getRawValue();
        this.usuarioService.loginUsuarios(values).subscribe((resp: any)=>{
            console.log(resp);
            if(resp.siglas == "OE"){
            if(resp.tipoUsuario == 1){
                this.docenteService.buscarDocente(resp.external_us).subscribe((docente:Docente)=>{
                    sessionStorage.setItem('datosUsuario',JSON.stringify(docente));
                    this.acceso_service.estaLogeado.next(docente);
                    if(docente.tipo_docente == "1"){
                        this.router.navigateByUrl(Rutas.registrarComunidad);
                    }else if(docente.tipo_docente == "2"){
                        this.router.navigateByUrl(Rutas.validarComunidad);
                    }else if(docente.tipo_docente == "3"){
                        this.router.navigateByUrl(Rutas.verificarInformacion);
                    }else if(docente.tipo_docente == "4"){
                        this.router.navigateByUrl(Rutas.aceptarComunidad);
                    }else if(docente.tipo_docente == "5"){
                        this.router.navigateByUrl(Rutas.planificarActividades);
                    }
                });
            }else if(resp.tipoUsuario == 2){
                this.estudianteService.buscarEstudiante(resp.external_us).subscribe((estudiante:Estudiante)=>{
                    sessionStorage.setItem('datosUsuario',JSON.stringify(estudiante));
                    this.acceso_service.estaLogeado.next(estudiante);

                    if(estudiante.estado == "1"){
                        this.router.navigateByUrl(Rutas.verComunidades);
                    }else if(estudiante.estado == "2"){ 
                        this.router.navigateByUrl(Rutas.perfilMiembto);
                    }
                });
                
            }
        }else{
            this.messageService.add({key: 'tc', severity:'error', summary: 'Error al iniciar sesión', detail: 'Usuario o Contraseña Incorrectos'});
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
        });
    }

    show(){
        this.display = true;
    }
    RecuperarClave(correo){
        let value = {"correo":correo}
        this.usuarioService.recuperarClave(value).subscribe((resp:any)=>{
            if(resp.siglas == "OE"){
                this.messageService.add({key: 'tc', severity:'success', summary: 'Operación Exitosa', detail: 'Se ha enviado un correo para la recuperación de su cuenta'});
                setTimeout(() => {
                    this._location.back();
                }, 2000);
            }else{
            this.messageService.add({key: 'tc', severity:'error', summary: 'Error', detail: 'Se ha producido un error'});
            }
        });
    }

    cancelar(){
        this._location.back();
    }
    registrarse(){
        this.router.navigateByUrl(Rutas.registro);
    }
}