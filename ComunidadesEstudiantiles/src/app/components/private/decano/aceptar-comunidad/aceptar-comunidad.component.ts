import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Comunidad } from 'src/app/core/model/comunidad';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
    selector: 'aceptarcomuniddad',
    templateUrl: './aceptar-comunidad.component.html',
    styleUrls: ['./aceptar-comunidad.component.css']
})

export class AceptarComunidadComponent implements OnInit {
    titulo: String;
    lista: Comunidad;
    estaLogeado: Boolean = false;
    params;
    hayDatos: boolean = false;
    imageSource: any;
    displayModal: boolean;
    comunidad="";
    constructor(
        private comunidad_service: ComunidadService,
        public router: Router,
        private _location: Location,
        private sanitizer: DomSanitizer

    ) {
        this.titulo = "Lista de Comunidades Validadas por el Gestor"
    }

    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        if ((this.params != null) && (this.params.tipo_docente == "4")) {
            this.estaLogeado = true;
        } else {
            alert("no estoy autorizado");
            this._location.back();
        }
        this.comunidad_service.listarComunidadesValidadas().subscribe((resp: Comunidad) => {
            this.lista = resp;
            for(let i in this.lista){
                this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'+this.lista[i].ruta_logo);
                this.lista[i].ruta_logo = this.imageSource;
            }
            console.log(this.lista);
            if (this.lista != null) {
                this.hayDatos = true;
            }
        });
    }

    show(external_comunidad){
        this.displayModal=true
        for(let i in this.lista){
            if(this.lista[i].external_comunidad == external_comunidad){
                this.comunidad = this.lista[i];
            }
        }
    }

    aceptarComunidad(external_comunidad) {
        console.log(external_comunidad);
        this.comunidad_service.aceptarComunidad(external_comunidad).subscribe((resp: any) => {
            console.log(resp); //revisar respuesta
            if(resp.siglas=="OE"){
                alert("Operación Exitosa");
                // window.location.reload();
                this.displayModal=false
                window.location.reload();
            }else{
                alert("Error al Aceptar");
            }
        });
    }

   rechazarComunidad(external_comunidad) {
        console.log(external_comunidad);
        this.comunidad_service.rechazarComunidad(external_comunidad).subscribe((resp: any) => {
            console.log(resp); //revisar respuesta
            if(resp.siglas=="OE"){
                alert("La solicitud ha sido Rechazada");
                // window.location.reload();
                this.displayModal=false
                window.location.reload();
            }else{
                alert("Error al Aceptar");
            }
        });
    }
}