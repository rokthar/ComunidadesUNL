import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { ActividadesService } from 'src/app/services/actividaes.service';
import { PdfMakeWrapper,Img } from 'pdfmake-wrapper';
import * as pdfFonts from 'pdfmake/build/vfs_fonts'; // fonts provided for pdfmake
import { Comunidad } from 'src/app/core/model/comunidad';

// Set the fonts to use
PdfMakeWrapper.setFonts(pdfFonts);


@Component({
    selector: 'reporte-actividades',
    templateUrl: './reporte-actividades.component.html',
    styleUrls: ['./reporte-actividades.component.css']
})

export class ReporteActividadesComponent implements OnInit {
    titulo;
    params: any="";
    comunidad:any="";
    logo_comunidad: any;
    actividades: any;
    constructor(
        private comunidad_service: ComunidadService,
        public router: Router,
        private actividad_service: ActividadesService
    ) {

    }
    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        console.log(this.params);
        if (this.params != null && this.params.tipo_docente == "5") {
            // this.estaLogeado=true;
            console.log(this.params);
            this.comunidad_service.buscarComunidadByTutor(this.params.external_docente).subscribe((com: any) => {
                this.comunidad = com;
                this.logo_comunidad = com.ruta_logo;
                console.log(this.comunidad);
                this.actividad_service.listarPlanificacionByComunidad(com.external_comunidad).subscribe((act: any) => {
                    this.actividades = act;
                    console.log(this.actividades);
                });
            });
        }

        
    }

    async generarReporte() {
        alert("generar reporte");
        // const pdf = new PdfMakeWrapper();
        // pdf.styles({
        //     style1: {
        //         bold: true,
        //         fontSize:10
        //     }
        // });
        // pdf.header('UNIVERSIDAD NACIONAL DE LOJA');
        // pdf.add('Reporte de Actividades Planificadas');
        // pdf.add('Comunidad: '+this.params.nombres+" "+this.params.apellidos);
        // pdf.add('Tutor: '+this.comunidad.nombre_comunidad);
        // pdf.add('Actividades Planificadas');
        // // pdf.add( await new Img('http://localhost/TT/comunidades/imagenes/comunidad/'+this.logo_comunidad).build());
        
        // pdf.create().open();
    }
}