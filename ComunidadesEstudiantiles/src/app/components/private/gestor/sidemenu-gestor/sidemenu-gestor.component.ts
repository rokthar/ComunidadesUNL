import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Rutas } from 'src/app/core/constants/rutas';

@Component({
    selector: 'sidemenu-gestor',
    templateUrl: './sidemenu-gestor.component.html',
    styleUrls: ['./sidemenu-gestor.component.css'],
    providers: [MessageService]
})

export class SideMenuGestorComponent implements OnInit {
    sidemenu: string;
    items: MenuItem[];

    constructor(
        private messageService: MessageService,
        public router: Router
    ) { }
    ngOnInit(): void {
        this.sidemenu = "ocultar";
        this.items = [
            {
                label: 'Validar',
                icon: 'pi pi-check-square',
                items: [
                    { label: 'Comunidades', icon: 'pi pi-globe', command: () => this.links('comunidades') },
                    { label: 'Actividades', icon: 'pi pi-calendar', command: () => this.links('actividades') }
                ]
            },
            {
                label: 'Configuraciones',
                icon: 'pi pi-cog',
                command: () => this.links('configuraciones')
            }
        ];

    }
    links(opcion) {
        switch (opcion) {
            case 'comunidades':
                this.router.navigateByUrl(Rutas.validarComunidad);
                break;
            case 'actividades':
                this.router.navigateByUrl(Rutas.validarActividades);
                break;
            case 'configuraciones':
                this.router.navigateByUrl(Rutas.configuracionesGestor);
                break;
            default:
                break;
        }
    }
    expanded() {
        if (this.sidemenu == "ocultar") {
            this.sidemenu = "mostrar"
        } else if (this.sidemenu == "mostrar") {
            this.sidemenu = "ocultar"
        }
    }
}