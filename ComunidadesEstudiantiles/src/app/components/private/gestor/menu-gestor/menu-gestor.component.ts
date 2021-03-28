import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Rutas } from 'src/app/core/constants/rutas';


@Component({
    selector: 'menu-gestor',
    templateUrl: './menu-gestor.component.html',
    styleUrls: ['./menu-gestor.component.css'],
    providers: [MessageService]
})

export class MenuGestorComponent implements OnInit {
    titulo;
    params: any;
    items: MenuItem[];

    logo_comunidad: any;
    ocultar: string = "ocultar";
    constructor(
        public router: Router,
        private messageService: MessageService
    ) {
        this.titulo = "Gestor"
    }
    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        this.items = [
            {
                label: 'Comunidades',
                items: [
                    {
                        label: 'Validar',
                        icon: 'pi pi-check',
                        command: () => this.links('validarComunidades')
                    }
                ]
            },
            {
                label: 'Actividades',
                items: [
                    {
                        label: 'Validar',
                        icon: 'pi pi-check',
                        command: () => this.links('validarActividades')
                    }
                ]
            },
            {
                label: 'Cerrar Sesión',
                icon: 'pi pi-power-off',
                command: () => this.mensaje()
            }
        ]
    }
    links(opcion){
        switch (opcion) {
            case 'validarComunidades':
                this.router.navigateByUrl(Rutas.validarComunidad);
                break;
            case 'validarActividades':
                this.router.navigateByUrl(Rutas.validarActividades);
                break;
            default:
                break;
        }
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