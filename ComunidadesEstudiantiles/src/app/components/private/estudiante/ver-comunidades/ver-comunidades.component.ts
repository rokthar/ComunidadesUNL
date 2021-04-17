import { Component, OnInit } from '@angular/core';
import { Comunidad } from 'src/app/core/model/comunidad';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { Router } from '@angular/router';
import { Rutas } from 'src/app/core/constants/rutas';
import { DomSanitizer } from '@angular/platform-browser';
import { PostulacionService } from 'src/app/services/postulacion.service';
import { URL } from '../../../../core/constants/url';
import { MessageService } from 'primeng/api';


@Component({
    selector: 'ver-comunidades',
    templateUrl: './ver-comunidades.component.html',
    styleUrls: ['./ver-comunidades.component.css'],
    providers: [MessageService]
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
        private postulacion_service:PostulacionService,
        private messageService: MessageService
    ){

    }
    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        
        this.postulacion_service.buscarPostulacion(this.params.external_estudiante).subscribe((post:any)=>{
            if(post.siglas != "OE"){
                this.postulado=false;
                this.comunidad_service.listarComunidades().subscribe((resp:Comunidad)=>{
                    this.lista = resp;
                });
            }else{
                console.log(post);
                this.postulado=true;
                this.datosPostulacion = post;
            }
        });
    }
    cancelar(){
        this.postulacion_service.cancelarPostulacion(this.params.external_estudiante).subscribe((resp:any)=>{
            if(resp.siglas == "OE"){
                this.messageService.add({ key: 'tc', severity: 'success', summary: 'Operación Exitosa', detail: 'La Postulación ha sido cancelada' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }else{
                this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Operación Fallida', detail: 'La Postulación no ha sido cancelada' });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
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