import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuItem } from 'primeng/api';
import { Resultados } from 'src/app/core/model/resultados';
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
    imagenes: any[];
    constructor(
        private _location: Location,
        private resultados_service: ResultadosService,
        private sanitizer: DomSanitizer

    ) {
        this.items=[];
    }
    ngOnInit(): void {
        this.external_resultado = sessionStorage.getItem('datosResultado');
        if (this.external_resultado != null) {
            this.resultados_service.listarResultado(this.external_resultado).subscribe((resp: Resultados) => {
                this.resultado = resp;
                this.imagenes = resp.imagenes;
            });
        } else {
            this._location.back();
        }
        
    }

    regresar() {
        this._location.back();
    }
}
