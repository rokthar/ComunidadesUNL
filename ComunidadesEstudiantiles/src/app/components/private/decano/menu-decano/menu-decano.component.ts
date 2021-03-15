import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';


@Component({
    selector: 'menu-decano',
    templateUrl: './menu-decano.component.html',
    styleUrls: ['./menu-decano.component.css'],
    providers: [MessageService]

})

export class MenuDecanoComponent implements OnInit{
    titulo;
    params: any;
    
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
        console.log(this.params);
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

    mostrarMenu(){
        // alert("olsi");
        if(this.ocultar=="ocultar"){
            this.ocultar="mostrar";
        }else if(this.ocultar=="mostrar"){
            this.ocultar="ocultar"
        }     
    }
    
}