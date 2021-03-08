import { Component, OnInit } from '@angular/core';
import { Postulacion } from 'src/app/core/model/postulacion';
import { PostulacionService } from 'src/app/services/postulacion.service';

@Component({
    selector: 'aceptarpostulacion',
    templateUrl: './aceptar-postulacion.component.html',
    styleUrls: ['./aceptar-postulacion.component.css']
})

export class AceptarPostulacionComponent implements OnInit{
    titulo:String;
    habilidades;
    lista:{}[] = [];
    private params;
    constructor(
       private postulacion_service:PostulacionService
    ){
        this.titulo = "Lista de Postulaciones"
    }
    ngOnInit(): void {
        this.params = JSON.parse(sessionStorage.getItem('datosUsuario'));
        console.log(this.params);
        this.postulacion_service.listarPostulaciones().subscribe((resp:Postulacion[])=>{
            //console.log(resp[1].external_postulacion);
            let habilidades : string= '';
            //resp.habilidades.forEach(habilidad=>habilidades += `${habilidad.habilidad}`);
            //this.lista.push({
             //           comunidad: resp.comunidad,
              //          estudiante: resp.estudiante,
              //          habilidades:habilidades
           // } );
             resp.forEach(_=>{
                habilidades='';
                 _.habilidades.forEach(habilidad=>habilidades += "|"+`${habilidad.habilidad}`+" Nivel: "+`${habilidad.nivel}`+" ");
                 this.lista.push({
                     comunidad: _.comunidad,
                     estudiante: _.estudiante,
                     habilidades:habilidades,
                     external_postulacion:_.external_postulacion
                 })
             });
        });
        console.log(this.lista);
    }

    aceptarPostulacion(external_postulacion){
        console.log(external_postulacion);
        //console.log(external_comunidad);
        this.postulacion_service.aceptarPostulacion(external_postulacion).subscribe((resp:any)=>{
            console.log(resp); //revisar respuesta
        });
    }
}