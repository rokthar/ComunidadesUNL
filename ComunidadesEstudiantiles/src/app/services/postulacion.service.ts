import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Estudiante } from '../core/model/estudiante';

@Injectable({
  providedIn: 'root'
})
export class PostulacionService {
  url="http://localhost/TT/comunidades/public/";

  constructor(
    private http: HttpClient
  ) {
   }

   postularseComunidad(external_estudiante,external_comunidad){
    return this.http.post(this.url+"estudiante/postulacion/"+external_estudiante+"/"+external_comunidad,null);
   }
   detallePostulacion(values, external_postulacion){
    return this.http.post(this.url+"estudiante/detallepostulacion/"+external_postulacion,values);
   }

   listarPostulaciones(external_comunidad){
      //return this.http.get(this.url+"comunidad/listar/comunidadesactivadas");
      return this.http.get(this.url+"comunidad/listarpostulacionespera/"+external_comunidad).pipe(pluck('data'));
   }

   aceptarPostulacion(external_postulacion){
    return this.http.post(this.url+"gestor/activarpostulacion/"+external_postulacion,null);
   }

   rechazarPostulacion(external_postulacion){
    return this.http.post(this.url+"postulacion/rechazar/"+external_postulacion,null);
   }

   buscarPostulacion(external_estudiante){
    //return this.http.get(this.url+"comunidad/listar/comunidadesactivadas");
    return this.http.get(this.url+"estudiante/buscarpostulacion/"+external_estudiante).pipe(pluck('data'));
 }
   añadirMiembro(external_postulacion){
    return this.http.post(this.url+"miembros/registrar/"+external_postulacion,null);
   }
}
