import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Rutas } from 'src/app/core/constants/rutas';


@Component({
    selector: 'menu-docente',
    templateUrl: './menu-docente.component.html',
    styleUrls: ['./menu-docente.component.css'],
    providers: [MessageService]
})

export class MenuDocenteComponent implements OnInit {
    titulo;
    params: any = null;
    items: MenuItem[];
    items2:MenuItem[];
    logo_comunidad: any;
    ocultar: string = "ocultar";
    constructor(
        public router: Router,
        private messageService: MessageService
    ) {
        this.titulo = "Docente"
    }
    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        this.items = [
            {label: 'Editar', icon: 'pi pi-pencil', command: () => {this.editar();}},
            {separator: true},
            {label: 'Cerrar Sesión', icon: 'pi pi-power-off', command: () => {this.mensaje();}},
        ];
    }

    editar() {
        this.router.navigateByUrl(Rutas.editarDocente);
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
        // alert("olsi");
        if (this.ocultar == "ocultar") {
            this.ocultar = "mostrar";
        } else if (this.ocultar == "mostrar") {
            this.ocultar = "ocultar"
        }
    }
}