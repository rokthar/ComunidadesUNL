import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Rutas } from 'src/app/core/constants/rutas';

@Component({
    selector: 'sidemenu-decano',
    templateUrl: './sidemenu-decano.component.html',
    styleUrls: ['./sidemenu-decano.component.css'],
    providers: [MessageService]
})

export class SideMenuDecanoComponent implements OnInit {
    sidemenu: string;
    items: MenuItem[];

    constructor(
        private messageService: MessageService,
        public router: Router
    ){}
    ngOnInit(): void {
        this.sidemenu="ocultar";
        this.items=[
            {
                label:'Validar',
                icon:'pi pi-check-square',
                items:[
                    {
                        label:'Comunidades',
                        icon:'pi pi-globe',
                        command: () => this.links('validarComunidades')
                    }
                ]
            }
        ];
    }
    links(opcion){
        switch (opcion) {
            case 'validarComunidades':
                this.router.navigateByUrl(Rutas.aceptarComunidad);
                break;
        
            default:
                break;
        }
    }
    expanded(){
        if(this.sidemenu=="ocultar"){
            this.sidemenu="mostrar"
        }else if(this.sidemenu=="mostrar"){
            this.sidemenu="ocultar"
        }
    }
}