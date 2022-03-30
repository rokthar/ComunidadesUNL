import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Rutas } from 'src/app/core/constants/rutas';

@Component({
    selector: 'sidemenu-docente',
    templateUrl: './sidemenu-docente.component.html',
    styleUrls: ['./sidemenu-docente.component.css'],
    providers: [MessageService]
})

export class SideMenuDocenteComponent implements OnInit {
    sidemenu: string;
    sidemenuIcon:string = "pi pi-bars barras";
    items: MenuItem[];

    constructor(
        private messageService: MessageService,
        public router: Router
    ){}
    ngOnInit(): void {
        this.sidemenu="ocultar";
        this.items = [
            {
                label: 'Registrar',
                icon:'pi pi-cloud-upload',
                items: [
                    {
                        label: 'Comunidad',
                        icon: 'pi pi-globe',
                        command: () => this.links('registrarComunidad')
                    }
                ]
            }
        ];
    }
    links(opcion) {
        switch (opcion) {
            case 'registrarComunidad':
                this.router.navigateByUrl(Rutas.registrarComunidad);
                break;

            default:
                break;
        }
    }
    expanded(){
        if(this.sidemenu=="ocultar"){
            this.sidemenu="mostrar";
            this.sidemenuIcon ="pi pi-times barras mostrarIcon";
        }else if(this.sidemenu=="mostrar"){
            this.sidemenu="ocultar";
            this.sidemenuIcon ="pi pi-bars barras ocultarIcon";
        }
    }
}