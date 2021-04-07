import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { jsPDF } from "jspdf";
import 'jspdf-autotable'
import { ActividadesService } from 'src/app/services/actividaes.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Alignment } from 'pdfmake/interfaces';
import { UsuarioService } from 'src/app/services/usuario.service';
import { URL } from '../../../../core/constants/url';
import { MenuItem } from 'primeng/api';
import { Rutas } from '../../../../core/constants/rutas';
import { Comunidad } from 'src/app/core/model/comunidad';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'menu-tutor',
    templateUrl: './menu-tutor.component.html',
    styleUrls: ['./menu-tutor.component.css'],
    providers: [MessageService]
})

export class MenuTutorComponent implements OnInit {
    items: MenuItem[];
    titulo;
    params: any;
    comunidad: any = "";
    logo_comunidad: any;
    actividades: any[];
    imageSource;
    img;
    listaHistorial;
    imagen = URL._imgCom;
    ocultar: string = "ocultar";
    constructor(
        private comunidad_service: ComunidadService,
        public router: Router,
        private actividad_service: ActividadesService,
        private sanitizer: DomSanitizer,
        private messageService: MessageService,
        private usuario_service: UsuarioService
    ) {
        this.titulo = "Tutor"
    }
    ngOnInit(): void {
       
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if (this.params != null && this.params.tipo_docente == "5") {
            this.comunidad_service.buscarComunidadByTutor(this.params.external_docente).subscribe((com: Comunidad) => {
                this.comunidad = com;
                this.logo_comunidad = com.ruta_logo;
            });
        }

        this.items = [
            {label: 'Editar', icon: 'pi pi-pencil', command: () => {this.editar();}},
            {label: 'Editar Comunidad', icon: 'pi pi-pencil', command: () => {this.router.navigateByUrl(Rutas.editarComunidad)}},
            {separator: true},
            {label: 'Cerrar Sesión', icon: 'pi pi-power-off', command: () => {this.mensaje();}},
        ];
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
    editar(){
        this.router.navigateByUrl(Rutas.editarTutor);
    }
}