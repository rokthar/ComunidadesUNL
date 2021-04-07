import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { MenuItem, MessageService } from 'primeng/api';
import { URL } from '../../../../core/constants/url';
import { Rutas } from 'src/app/core/constants/rutas';
import { Estudiante } from 'src/app/core/model/estudiante';


@Component({
    selector: 'menu-miembros',
    templateUrl: './menu-miembros.component.html',
    styleUrls: ['./menu-miembros.component.css'],
    providers: [MessageService]
})

export class MenuMiembrosComponent implements OnInit {
    items: MenuItem[];
    titulo;
    params: Estudiante;
    imagen = URL._imgCom;
    logo_comunidad: any;
    comunidad: any = "";
    imageSource: any = "";
    ocultar: string = "ocultar";
    constructor(
        public router: Router,
        private estudiante_service: EstudianteService,
        private sanitizer: DomSanitizer,
        private messageService: MessageService
    ) {
        this.titulo = "Miembro"
    }
    ngOnInit(): void {
        this.items = [
            {label: 'Editar', icon: 'pi pi-pencil', command: () => {this.editar();}},
            {separator: true},
            {label: 'Cerrar Sesión', icon: 'pi pi-power-off', command: () => {this.mensaje();}},
        ];

        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if (this.params != null) {
            this.estudiante_service.buscarComunidadByMiembro(this.params.external_estudiante).subscribe((resp: any) => {
                this.comunidad = resp;
            });
        }
    }

    editar(){
        this.router.navigateByUrl(Rutas.editarMiembro);
    }
    cerrarSesion() {
        sessionStorage.clear();
        this.router.navigateByUrl('');
    }
    mensaje() {
        this.messageService.add({ key: 'tc', severity: 'info', summary: 'Cerrando Sesión', detail: 'Hasta Luego' });
        setTimeout(() => {
            this.cerrarSesion()
        }, 1500);
    }

    mostrarMenu() {
        if (this.ocultar == "ocultar") {
            this.ocultar = "mostrar";
        } else if (this.ocultar == "mostrar") {
            this.ocultar = "ocultar"
        }
    }
}