import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuItem } from 'primeng/api';
import { ResultadosService } from 'src/app/services/resultados.service';
import { URL } from '../../../core/constants/url';

@Component({
    selector: 'ver-resultados',
    templateUrl: './ver-resultados.component.html',
    styleUrls: ['./ver-resultados.component.css']
})

export class VerResultadosComponent implements OnInit {
    items: MenuItem[];
    external_resultado: string;
    resultado = null;
    imageSource: any;
    imagen = URL._imgResul;
    img_con = URL._imgCom;
    constructor(
        private _location: Location,
        private resultados_service: ResultadosService,
        private sanitizer: DomSanitizer

    ) {
        this.items=[];
    }
    ngOnInit(): void {
        this.external_resultado = sessionStorage.getItem('datosResultado');
        console.log(this.external_resultado);
        if (this.external_resultado != null) {
            this.resultados_service.listarResultado(this.external_resultado).subscribe((resp: any) => {
                this.resultado = resp;
            });
        } else {
            this._location.back();
        }
    }

    regresar() {
        this._location.back();
    }

    mostrarImg(img){
        // this.displayResponsive = true;
        // this.imagen = URL._imgResul+img;
    }
}