import { Location } from '@angular/common';
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
export class GestionUsuariosComponent implements OnInit {
    listaDocentes: any = "";
    params: any;
    listaEstudiantes: any = "";
    estaLogeado: Boolean = false;
    constructor(
        private usuario_service: UsuarioService,
        private _location: Location
    ) { }
    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));

        if ((this.params != null) && (this.params.estado == "1")) {
            this.estaLogeado = true;
        } else {
            // this._location.back();
        }
        this.usuario_service.listarDocentesEstado().subscribe((docentes: any) => {
            this.listaDocentes = docentes;
        });
        this.usuario_service.listarEstudiantesEstado().subscribe((estudiantes: any) => {
            this.listaEstudiantes = estudiantes;
        });
    }

    activarUsuario(indice, event) {
        this.usuario_service.ActivarUsuario(this.listaDocentes[indice].external_usuario).subscribe((resp: any) => {
            window.location.reload();
        });
    }
    desactivarUsuario(indice, event) {
        this.usuario_service.DesactivarUsuario(this.listaDocentes[indice].external_usuario).subscribe((resp: any) => {
            window.location.reload();
        });
    }

}