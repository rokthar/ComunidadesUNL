import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Estudiante } from '../core/model/estudiante';
import { URL } from '../core/constants/url';


@Injectable({
  providedIn: 'root'
})
export class PostulacionService {
  // url="http://localhost/TT/ComunidadesUNL/comunidades/public/";
  // url = "https://comunidadesestudiantiles.000webhostapp.com/comunidades/public/";

  constructor(
    private http: HttpClient
  ) {
   }

   postularseComunidad(external_estudiante,external_comunidad){
    return this.http.post(URL._url+"estudiante/postulacion/"+external_estudiante+"/"+external_comunidad,null);
   }
   detallePostulacion(values, external_postulacion){
    return this.http.post(URL._url+"estudiante/detallepostulacion/"+external_postulacion,values);
   }

   listarPostulaciones(external_comunidad){
      //return this.http.get(this.url+"comunidad/listar/comunidadesactivadas");
      return this.http.get(URL._url+"comunidad/listarpostulacionespera/"+external_comunidad).pipe(pluck('data'));
   }

   aceptarPostulacion(values,external_postulacion){
    return this.http.post(URL._url+"gestor/activarpostulacion/"+external_postulacion,values);
   }

   rechazarPostulacion(values,external_postulacion){
    return this.http.post(URL._url+"postulacion/rechazar/"+external_postulacion,values);
   }

   buscarPostulacion(external_estudiante){
    //return this.http.get(this.url+"comunidad/listar/comunidadesactivadas");
    return this.http.get(URL._url+"estudiante/buscarpostulacion/"+external_estudiante).pipe(pluck('data'));
 }
   añadirMiembro(external_postulacion){
    return this.http.post(URL._url+"miembros/registrar/"+external_postulacion,null);
   }
}
