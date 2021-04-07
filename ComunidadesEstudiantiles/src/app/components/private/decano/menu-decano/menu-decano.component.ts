import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Rutas } from 'src/app/core/constants/rutas';


@Component({
    selector: 'menu-decano',
    templateUrl: './menu-decano.component.html',
    styleUrls: ['./menu-decano.component.css'],
    providers: [MessageService]

})

export class MenuDecanoComponent implements OnInit{
    titulo;
    params: any;
    items: MenuItem[];
    logo_comunidad: any;
    ocultar: string="ocultar";
    constructor(
        public router:Router,
        private messageService: MessageService
    ){
        this.titulo="Tutor"
    }
    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        this.items = [
            {label: 'Editar', icon: 'pi pi-pencil', command: () => {this.editar();}},
            {separator: true},
            {label: 'Cerrar Sesión', icon: 'pi pi-power-off', command: () => {this.mensaje();}},
        ];;
    }

    cerrarSesion() {
        sessionStorage.clear();
        this.router.navigateByUrl('');
    }
    editar(){
        this.router.navigateByUrl(Rutas.editarDecano);
    }
    mensaje() {
        this.messageService.add({ key: 'tc', severity: 'info', summary: 'Cerrando Sesión', detail: 'Hasta Luego' });
        setTimeout(() => {
            this.cerrarSesion()
        }, 1500);
    }

    mostrarMenu(){
        // alert("olsi");
        if(this.ocultar=="ocultar"){
            this.ocultar="mostrar";
        }else if(this.ocultar=="mostrar"){
            this.ocultar="ocultar"
        }     
    }
    
}