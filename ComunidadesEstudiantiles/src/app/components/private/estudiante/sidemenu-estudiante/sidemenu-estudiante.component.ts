import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Rutas } from 'src/app/core/constants/rutas';

@Component({
    selector: 'sidemenu-estudiante',
    templateUrl: './sidemenu-estudiante.component.html',
    styleUrls: ['./sidemenu-estudiante.component.css'],
    providers: [MessageService]
})

export class SideMenuEstudianteComponent implements OnInit {
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
                label: 'Comunidades',
                items: [
                    {
                        label: 'Postularse',
                        icon: 'pi pi-user-plus',
                        command: () => this.links('postularse')
                    }
                ]
            }
        ];
    }
    links(opcion){
        switch (opcion) {
            case 'postularse':
                this.router.navigateByUrl(Rutas.verComunidades);
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