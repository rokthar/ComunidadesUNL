import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'sidemenu-estudiante',
    templateUrl: './sidemenu-estudiante.component.html',
    styleUrls: ['./sidemenu-estudiante.component.css'],
    providers: [MessageService]
})

export class SideMenuEstudianteComponent implements OnInit {
    sidemenu: string;
    constructor(
        private messageService: MessageService,
        public router: Router
    ){}
    ngOnInit(): void {
        this.sidemenu="ocultar"
    }
    expanded(){
        if(this.sidemenu=="ocultar"){
            this.sidemenu="mostrar"
        }else if(this.sidemenu=="mostrar"){
            this.sidemenu="ocultar"
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
}