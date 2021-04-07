import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResultadosService } from 'src/app/services/resultados.service';
import { Rutas } from 'src/app/core/constants/rutas';
import { DomSanitizer } from '@angular/platform-browser';
import { URL } from '../../../core/constants/url';
import { Resultados } from 'src/app/core/model/resultados';


@Component({
    selector: 'resultados-preview',
    templateUrl: './resultados-preview.component.html',
    styleUrls: ['./resultados-preview.component.css']
})

export class ResultadosPreviewComponent implements OnInit{

    resultados=null;
    imageSource: any;
    imagen;
    constructor(
        private resultados_service:ResultadosService,
        public router:Router,
        private sanitizer: DomSanitizer

    ){

    }
    ngOnInit(): void {
        this.imagen = URL._imgResul;
       this.resultados_service.listarResultados().subscribe((resp:Resultados)=>{
        this.resultados = resp;
       });
    }

    enviar(external_resultado){
        sessionStorage.setItem('datosResultado',external_resultado);
        this.router.navigateByUrl(Rutas.verResultados);

    }   

}