import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ResultadosService } from 'src/app/services/resultados.service';
import { Router } from '@angular/router';
import { Rutas } from 'src/app/core/constants/rutas';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'main-miembros',
    templateUrl: './main-miembros.component.html',
    styleUrls: ['./main-miembros.component.css']
})

export class PerfilMiembrosComponent implements OnInit{
    params: any;
    resultados: any;
    titulo;
    hayDatos:boolean;
    imageSource: any;
    constructor(
        private resultados_service:ResultadosService,
        private _location:Location,
        public router:Router,
        private sanitizer: DomSanitizer

    ){
        this.titulo = "Lista de Resultados de la Comunidad"
    }
    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        console.log(this.params);
        if(this.params != null && this.params.estado=="2"){
            this.resultados_service.listarResultadoByMiembro(this.params.external_estudiante).subscribe((resp:any)=>{
                console.log(resp);
                this.resultados = resp;
                for(let i in this.resultados){
                    for(let j in this.resultados[i].imagenes){
                        this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'+this.resultados[i].imagenes[j].ruta_imagen);
                        this.resultados[i].imagenes[j].ruta_imagen = this.imageSource
                    }
                    // console.log("a");
                }
                if(resp != null){
                    this.hayDatos=true;
                }else{
                    this.hayDatos=false;
                }
               }); 
        }else{
            alert("no estoy autorizado");
            this._location.back();
        }
        
    }

    enviar(external_resultado){
        console.log(external_resultado);
        sessionStorage.setItem('datosResultado',external_resultado);
        this.router.navigateByUrl(Rutas.visualizarResultados);
    }   

}