import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResultadosService } from 'src/app/services/resultados.service';
import { Rutas } from 'src/app/core/constants/rutas';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
    selector: 'resultados-preview',
    templateUrl: './resultados-preview.component.html',
    styleUrls: ['./resultados-preview.component.css']
})

export class ResultadosPreviewComponent implements OnInit{

    resultados=null;
    imageSource: any;
    constructor(
        private resultados_service:ResultadosService,
        public router:Router,
        private sanitizer: DomSanitizer

    ){

    }
    ngOnInit(): void {

       this.resultados_service.listarResultados().subscribe((resp:any)=>{
        this.resultados = resp;
        for(let i in this.resultados){
            for(let j in this.resultados[i].imagenes){
                this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'+this.resultados[i].imagenes[j].ruta_imagen);
                this.resultados[i].imagenes[j].ruta_imagen = this.imageSource
            }
            // console.log("a");
        }
        
        console.log(this.resultados); 
       });
    }

    enviar(external_resultado){
        console.log(external_resultado);
        sessionStorage.setItem('datosResultado',external_resultado);
        this.router.navigateByUrl(Rutas.verResultados);

    }   

}