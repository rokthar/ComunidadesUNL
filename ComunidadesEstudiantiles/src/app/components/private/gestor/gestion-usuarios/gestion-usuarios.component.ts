import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Docente } from 'src/app/core/model/docente';
import { DocenteService } from 'src/app/services/docente.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css'],
  providers: [MessageService]
})
export class GestionUsuariosComponent implements OnInit{
    listaDocentes: any="";
    listaEstudiantes: any="";
    
    constructor(
        private usuario_service:UsuarioService
    ){}
    ngOnInit(): void {
        this.usuario_service.listarDocentesEstado().subscribe((docentes:any)=>{
            this.listaDocentes = docentes;
            console.log(docentes);
        });
        this.usuario_service.listarEstudiantesEstado().subscribe((estudiantes:any)=>{
            this.listaEstudiantes = estudiantes;
            console.log(estudiantes);
        });
    }

    activarUsuario(indice, event){
        console.log(this.listaDocentes[indice].external_usuario);
        this.usuario_service.ActivarUsuario(this.listaDocentes[indice].external_usuario).subscribe((resp:any) => {
            console.log(resp);
            window.location.reload();
          });
    }
    desactivarUsuario(indice, event){
        this.usuario_service.DesactivarUsuario(this.listaDocentes[indice].external_usuario).subscribe((resp:any) => {
            console.log(resp);
            window.location.reload();
          });
    }
    
}