import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ResultadosService } from 'src/app/services/resultados.service';


@Component({
    selector: 'ver-resultados',
    templateUrl: './ver-resultados.component.html',
    styleUrls: ['./ver-resultados.component.css']
})

export class VerResultadosComponent implements OnInit{
    external_resultado:string;
    resultado;
    imageSource: any;
    constructor(
        private _location:Location,
        private resultados_service:ResultadosService,
        private sanitizer: DomSanitizer

    ){
        
    }
    ngOnInit(): void {
        this.external_resultado = sessionStorage.getItem('datosResultado');
        console.log(this.external_resultado);
        if(this.external_resultado != null){
            this.resultados_service.listarResultado(this.external_resultado).subscribe((resp:any)=>{
                this.resultado = resp;
                this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'+this.resultado.comunidad_logo);
                this.resultado.comunidad_logo = this.imageSource;
                for(let j in this.resultado.imagenes){
                    this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'+this.resultado.imagenes[j].ruta_imagen);
                    this.resultado.imagenes[j].ruta_imagen = this.imageSource
                }
                console.log(this.resultado);
            });
        }else{
            this._location.back();
        }
    }

    regresar(){
        this._location.back();
    }
}
