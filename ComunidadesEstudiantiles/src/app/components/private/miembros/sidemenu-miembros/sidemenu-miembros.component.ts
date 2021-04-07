import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Rutas } from 'src/app/core/constants/rutas';
import { Estudiante } from 'src/app/core/model/estudiante';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { URL } from '../../../../core/constants/url';

@Component({
    selector: 'sidemenu-miembros',
    templateUrl: './sidemenu-miembros.component.html',
    styleUrls: ['./sidemenu-miembros.component.css'],
    providers: [MessageService]
})

export class SideMenuMiembrosComponent implements OnInit {
    sidemenu: string;
    items: MenuItem[];
    params: Estudiante;
    comunidad: any;
    imagen = URL._imgCom;

    constructor(
        private messageService: MessageService,
        public router: Router,
        private estudiante_service:EstudianteService
    ){}
    ngOnInit(): void {
        this.sidemenu="ocultar";
        this.items = [
            {
                label: 'Perfil',
                items: [
                    {
                        label: 'Ver Resultados',
                        icon: 'pi pi-eye',
                        command: () => this.links('verResultados')
                    }
                ]
            }
        ];

        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if (this.params != null) {
            this.estudiante_service.buscarComunidadByMiembro(this.params.external_estudiante).subscribe((resp: any) => {
                this.comunidad = resp;
            });
        }
    }

    links(opcion){
        switch (opcion) {
            case 'verResultados':
                this.router.navigateByUrl(Rutas.perfilMiembto);
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