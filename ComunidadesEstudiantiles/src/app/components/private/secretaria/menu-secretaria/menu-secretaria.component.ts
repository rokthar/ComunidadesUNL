import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Rutas } from 'src/app/core/constants/rutas';


@Component({
    selector: 'menu-secretaria',
    templateUrl: './menu-secretaria.component.html',
    styleUrls: ['./menu-secretaria.component.css'],
    providers: [MessageService]
})

export class MenuSecretariaComponent implements OnInit {
    titulo;
    params: any;
    items: MenuItem[];
    logo_comunidad: any;
    ocultar: string = "ocultar";
    constructor(
        public router: Router,
        private messageService: MessageService
    ) {
        this.titulo = "Secretaria"
    }
    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
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
            },
            {
                label: 'Cerrar Sesión',
                icon: 'pi pi-power-off',
                command: () => this.mensaje()
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