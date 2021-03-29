import { Component, OnInit } from '@angular/core';
import { Comunidad } from 'src/app/core/model/comunidad';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { Router } from '@angular/router';
import { Rutas } from 'src/app/core/constants/rutas';
import { DomSanitizer } from '@angular/platform-browser';
import { PostulacionService } from 'src/app/services/postulacion.service';
import { URL } from '../../../../core/constants/url';



@Component({
    selector: 'ver-comunidades',
    templateUrl: './ver-comunidades.component.html',
    styleUrls: ['./ver-comunidades.component.css']
})

export class VerComunidadesComponent implements OnInit{
    lista;
    imageSource: any;
    params: any;
    postulado: boolean;
    datosPostulacion="";
    imagen = URL._imgCom;
    comunidad="";
    displayModal: boolean;
    constructor(
        private comunidad_service:ComunidadService,
        public router:Router,
        private sanitizer: DomSanitizer,
        private postulacion_service:PostulacionService

    ){

    }
    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        this.comunidad_service.listarComunidades().subscribe((resp:Comunidad)=>{
            this.lista = resp;
            this.postulacion_service.buscarPostulacion(this.params.external_estudiante).subscribe((post:any)=>{
                // console.log(post);
                if(post.siglas != "OE"){
                    this.postulado=false;
                    
                }else{
                    this.postulado=true;
                    this.datosPostulacion = post;
                }
            });
        });
    }

    seleccionar(external_comunidad){
        sessionStorage.setItem('datosComunidad',external_comunidad);
        this.router.navigateByUrl(Rutas.postulacion);

    }
    detalles(external_comunidad){
        this.displayModal=true
        for(let i in this.lista){
            if(this.lista[i].external_comunidad == external_comunidad){
                this.comunidad = this.lista[i];
            }
        }
    }
}