import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { MessageService } from 'primeng/api';


@Component({
    selector: 'menu-miembros',
    templateUrl: './menu-miembros.component.html',
    styleUrls: ['./menu-miembros.component.css'],
    providers: [MessageService]
})

export class MenuMiembrosComponent implements OnInit{
    titulo;
    params: any;
    
    logo_comunidad: any;
    comunidad: any="";
    imageSource: any="";
    ocultar: string="ocultar";
    constructor(
        public router:Router,
        private estudiante_service:EstudianteService,
        private sanitizer: DomSanitizer,
        private messageService: MessageService
    ){
        this.titulo="Miembro"
    }
    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if(this.params != null){
            this.estudiante_service.buscarComunidadByMiembro(this.params.external_estudiante).subscribe((resp:any)=>{
                this.comunidad = resp;
                this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'+this.comunidad.ruta_logo);
                this.comunidad.ruta_logo = this.imageSource;
            });
        }
        // console.log(this.params);
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