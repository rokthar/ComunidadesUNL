import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Rutas } from 'src/app/core/constants/rutas';

@Component({
    selector: 'sidemenu-secretaria',
    templateUrl: './sidemenu-secretaria.component.html',
    styleUrls: ['./sidemenu-secretaria.component.css'],
    providers: [MessageService]
})

export class SideMenuSecretariaComponent implements OnInit {
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
                        label: 'Verificar',
                        icon: 'pi pi-check-circle',
                        command: () => this.links('verificarInformacion')
                    }
                ]
            }
        ];
    }
    links(opcion){
        switch (opcion) {
            case 'verificarInformacion':
                this.router.navigateByUrl(Rutas.verificarInformacion);
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