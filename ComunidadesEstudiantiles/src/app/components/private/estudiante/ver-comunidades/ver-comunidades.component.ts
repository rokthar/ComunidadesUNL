import { Component, OnInit } from '@angular/core';
import { Comunidad } from 'src/app/core/model/comunidad';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { Router } from '@angular/router';
import { Rutas } from 'src/app/core/constants/rutas';
import { DomSanitizer } from '@angular/platform-browser';
import { PostulacionService } from 'src/app/services/postulacion.service';



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
                    console.log(this.datosPostulacion);
                }
            });
            for(let i in this.lista){
                this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'+this.lista[i].ruta_logo);
                this.lista[i].ruta_logo = this.imageSource;
            }
            console.log(this.lista);
        });
    }

    seleccionar(external_comunidad){
        sessionStorage.setItem('datosComunidad',external_comunidad);
        this.router.navigateByUrl(Rutas.postulacion);

    }
}