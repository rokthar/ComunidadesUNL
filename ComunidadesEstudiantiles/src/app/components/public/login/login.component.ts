import { componentFactoryName } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Rutas } from 'src/app/core/constants/rutas';
import { Docente } from 'src/app/core/model/docente';
import { Estudiante } from 'src/app/core/model/estudiante';
import { Usuario } from 'src/app/core/model/usuario';
import { DocenteService } from 'src/app/services/docente.service';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent {
    public titulo: string;
    public comentario: string;
    

    loginForm: FormGroup;
    constructor(
        private usuarioService:UsuarioService,
        private docenteService:DocenteService,
        private estudianteService:EstudianteService,
        private _builder:FormBuilder,
        public router:Router
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
        this.usuarioService.loginUsuarios(values).subscribe((resp: Usuario)=>{
            if(resp.tipoUsuario == 1){
                this.docenteService.buscarDocente(resp.external_us).subscribe((docente:Docente)=>{
                    sessionStorage.setItem('datosUsuario',JSON.stringify(docente));
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
                    if(estudiante.estado == "1"){
                        this.router.navigateByUrl(Rutas.postulacion);
                    }else if(estudiante.estado == "2"){ 
                        console.log("miembros");
                    }
                });
                
            }
        });
        //console.log(values.correo);
    }

    cancelar(){
        console.log("sali del form");
    }
}