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

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'menu-tutor',
    templateUrl: './menu-tutor.component.html',
    styleUrls: ['./menu-tutor.component.css'],
    providers: [MessageService]
})

export class MenuTutorComponent implements OnInit {
    titulo;
    params: any;
    comunidad: any = "";
    logo_comunidad: any;
    actividades: any[];
    imageSource;
    img;
    listaHistorial;
    ocultar: string = "ocultar";
    constructor(
        private comunidad_service: ComunidadService,
        public router: Router,
        private actividad_service: ActividadesService,
        private sanitizer: DomSanitizer,
        private messageService: MessageService
    ) {
        this.titulo = "Tutor"
    }
    ngOnInit(): void {

        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        console.log(this.params);
        if (this.params != null && this.params.tipo_docente == "5") {
            // this.estaLogeado=true;
            // console.log(this.params);
            this.comunidad_service.buscarComunidadByTutor(this.params.external_docente).subscribe((com: any) => {
                this.comunidad = com;
                this.logo_comunidad = com.ruta_logo;
                this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.logo_comunidad);
                console.log(this.comunidad);
                this.comunidad_service.historial(this.comunidad.external_comunidad).subscribe((hsitorial: any) => {
                    this.listaHistorial = hsitorial;
                });
                this.actividad_service.listarPlanificacionByComunidad(com.external_comunidad).subscribe((act: any) => {
                    this.actividades = act;
                    // console.log(this.actividades);
                });
            });


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

    generarReporteActividades() {
        let rowsActividades = [];

        rowsActividades.push(["Fecha Inicio","Actividad","Descripción"]);
        
        for (let i in this.listaHistorial.actividades) {
            let datos = [];
            datos.push(
                this.listaHistorial.actividades[i].fecha_inicio,
                this.listaHistorial.actividades[i].nombre_actividad,
                this.listaHistorial.actividades[i].descripcion_actividad
            );
            rowsActividades.push(datos);
        }

        let docDefinition = {
            content: [
                // Previous configuration  
                {
                    text: 'UNIVERSIDAD NACIONAL DE LOJA',
                    style: 'header'
                },
                {
                    text: [
                        {text: 'FACULTAD DE LAS ENERGÍAS, LAS INDUSTRIAS Y LOS RECURSOS NATURALES NO RENOVABLES\n'},
                        {text:'INGENIERÍA EN SISTEMAS\n\n\n'}
                    ],
                    style: 'subheader'
                },
                {
                    image: 'data:image/png;base64,' +this.logo_comunidad,
                    width: 50,
			        height: 50
                },
                {
                    text:[
                        {text:'\nComunidad: ', bold:true}, this.comunidad.nombre_comunidad+'\n',
                        {text:'Tutor: ',bold:true},this.params.nombres + " " + this.params.apellidos+'\n\n\n'
                    ],
                    style: 'texto'
                },
                {
                    text: 'REPORTE DE LA PLANIFICACIÓN DE ACTIVIDADES\n\n',
                    style: 'titulos'
                },
                {
                    text:'\n\nLista de Actividades de la Comunidad\n\n',
                    style:'subtitulos'
                },
                {
                    style:'tablasTexto',
                    table: {
                        headerRows: 1,
                        widths: [ 'auto', 'auto','auto'],
                        body: rowsActividades
                     },
                     layout: {
                        fillColor: function (rowIndex, node, columnIndex) {
                            return (rowIndex === 0) ? '#1d3557' : '#457b9d';
                        }
                    }
                },
                {
                    text:[
                        {text:'\n\n\n\n_______________________________________________\n'},
                        {text:this.params.nombres + " " + this.params.apellidos+'\n'},
                        {text:'Tutor de la comunidad '+ this.comunidad.nombre_comunidad+'\n'}
                    ],
                    style: 'firmas'
                }

            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center' as Alignment
                },
                subheader: {
                    fontSize: 10,
                    bold: true,
                    alignment: 'center' as Alignment
                },
                texto: {
                    fontSize: 12,
                    alignment: 'justify' as Alignment
                },
                firmas:{
                    alignment: 'center' as Alignment
                },
                titulos: {
                    fontSize: 12,
                    bold: true,
                    alignment: 'center' as Alignment
                },
                subtitulos:{
                    fontSize: 12,
                    bold: true,
                    alignment: 'justify' as Alignment
                },
                tablasTexto:{
                    color:'#fafafa'
                },
                imagenes:{
                    alignment: 'center' as Alignment
                }                
            }
        };

        pdfMake.createPdf(docDefinition).open();
    }

    

    mostrarMenu() {
        // alert("olsi");
        if (this.ocultar == "ocultar") {
            this.ocultar = "mostrar";
        } else if (this.ocultar == "mostrar") {
            this.ocultar = "ocultar"
        }
    }

    generarReporteHistorial() {
        let rowsMiembros = [];
        let rowsActividades = [];
        let rowsResultados = [];

        rowsMiembros.push(["Num","Nombres y Apellidos"]);
        rowsActividades.push(["Fecha Inicio","Actividad","Descripción"]);
        rowsResultados.push(["Fecha Fin","Resumen"]);
        
        for (let i in this.listaHistorial.miembros) {
            // row = row + 30;
            let datos = [];
            datos.push(i+1,
                this.listaHistorial.miembros[i].estudiante);
            rowsMiembros.push(datos);
        }
        
        for (let i in this.listaHistorial.actividades) {
            let datos = [];
            datos.push(
                this.listaHistorial.actividades[i].fecha_inicio,
                this.listaHistorial.actividades[i].nombre_actividad,
                this.listaHistorial.actividades[i].descripcion_actividad
            );
            rowsActividades.push(datos);
        }

        for (let i in this.listaHistorial.resultados) {
            let datos = [];
            datos.push(this.listaHistorial.resultados[i].fecha_fin,
                this.listaHistorial.resultados[i].resumen_resultado);
            rowsResultados.push(datos);
        }

        let docDefinition = {
            content: [
                // Previous configuration  
                {
                    image: 'data:image/png;base64,' +this.logo_comunidad,
                    width: 50,
			        height: 50,
                    style:'imagenes'
                },
                {
                    text: 'UNIVERSIDAD NACIONAL DE LOJA',
                    style: 'header'
                },
                {
                    text: [
                        {text: 'FACULTAD DE LAS ENERGÍAS, LAS INDUSTRIAS Y LOS RECURSOS NATURALES NO RENOVABLES\n'},
                        {text:'INGENIERÍA EN SISTEMAS\n\n\n'}
                    ],
                    style: 'subheader'
                },
                {
                    text:[
                        {text:'Comunidad: ', bold:true}, this.comunidad.nombre_comunidad+'\n',
                        {text:'Tutor: ',bold:true},this.params.nombres + " " + this.params.apellidos+'\n\n\n'
                    ],
                    style: 'texto'
                },
                {
                    text: 'REPORTE DEL HISTORIAL DE ACTIVIDADES DE LA COMUNIDAD\n\n',
                    style: 'titulos'
                },
                {
                    text:'Lista de Miembros de la Comunidad\n\n',
                    style:'subtitulos'
                },
                {
                    style:'tablasTexto',
                    table: {
                        headerRows: 1,
                        widths: [ 'auto', 'auto'],
                        body: rowsMiembros
                     },
                     layout: {
                        fillColor: function (rowIndex, node, columnIndex) {
                            return (rowIndex === 0) ? '#1d3557' : '#457b9d';
                        }
                    }
                },
                {
                    text:'\n\nLista de Actividades de la Comunidad\n\n',
                    style:'subtitulos'
                },
                {
                    style:'tablasTexto',
                    table: {
                        headerRows: 1,
                        widths: [ 'auto', 'auto','auto'],
                        body: rowsActividades
                     },
                     layout: {
                        fillColor: function (rowIndex, node, columnIndex) {
                            return (rowIndex === 0) ? '#1d3557' : '#457b9d';
                        }
                    }
                },
                {
                    text:'\n\nLista de Resultados de la Comunidad\n\n',
                    style:'subtitulos'
                },
                {
                    style:'tablasTexto',
                    table: {
                        headerRows: 1,
                        widths: [ 'auto', 'auto'],
                        body: rowsResultados
                     },
                     layout: {
                        fillColor: function (rowIndex, node, columnIndex) {
                            return (rowIndex === 0) ? '#1d3557' : '#457b9d';
                        }
                    }
                },
                {
                    text:[
                        {text:'\n\n\n\n_______________________________________________\n'},
                        {text:this.params.nombres + " " + this.params.apellidos+'\n'},
                        {text:'Tutor de la comunidad '+ this.comunidad.nombre_comunidad+'\n'}
                    ],
                    style: 'firmas'
                }

            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center' as Alignment
                },
                subheader: {
                    fontSize: 10,
                    bold: true,
                    alignment: 'center' as Alignment
                },
                texto: {
                    fontSize: 12,
                    alignment: 'justify' as Alignment
                },
                firmas:{
                    alignment: 'center' as Alignment
                },
                titulos: {
                    fontSize: 12,
                    bold: true,
                    alignment: 'center' as Alignment
                },
                subtitulos:{
                    fontSize: 12,
                    bold: true,
                    alignment: 'justify' as Alignment
                },
                tablasTexto:{
                    color:'#fafafa'
                },
                imagenes:{
                    alignment: 'center' as Alignment
                }                
            }
        };

        pdfMake.createPdf(docDefinition).open();
    }
}