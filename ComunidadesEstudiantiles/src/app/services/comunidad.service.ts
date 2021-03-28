import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Comunidad } from '../core/model/comunidad';
import { URL } from '../core/constants/url';


@Injectable({
  providedIn: 'root'
})
export class ComunidadService {
  // url="http://localhost/TT/ComunidadesUNL/comunidades/public/";
  // url = "https://comunidadesestudiantiles.000webhostapp.com/comunidades/public/";
  constructor(
    private http: HttpClient
  ) {
   }

   registrarComunidad(values,external_docente){
    //return this.http.get(this.url+"comunidad/listar/comunidadesactivadas");
    return this.http.post(URL._url+"comunidad/registro/"+external_docente,values);
   }

   listarComunidadesEspera():Observable<Comunidad>{
    return this.http.get(URL._url+"secretaria/listar/comunidades").pipe(pluck('data'));
   }

   revisionInformacion(values,external_comunidad){
    return this.http.post(URL._url+"secretaria/activar/"+external_comunidad,values);
   }

   listarComunidadesRevisadas():Observable<Comunidad>{
    return this.http.get(URL._url+"gestor/listar/comunidades").pipe(pluck('data'));
   }

   validarComunidad(values,external_comunidad){
    return this.http.post(URL._url+"gestor/activar/"+external_comunidad,values);
   }

   listarComunidadesValidadas():Observable<Comunidad>{
    return this.http.get(URL._url+"decano/listar/comundades").pipe(pluck('data'));
   }

   aceptarComunidad(external_comunidad){
    return this.http.post(URL._url+"decano/activar/"+external_comunidad,null);
   }

   rechazarComunidad(values, external_comunidad){
    return this.http.post(URL._url+"comunidad/rechazar/"+external_comunidad,values);
   }

   listarComunidades():Observable<Comunidad>{
    return this.http.get(URL._url+"comunidad/listar/comunidadesactivadas").pipe(pluck('data'));
   }
   listarComunidadesVinculacion(external_comunidad):Observable<Comunidad>{
    return this.http.get(URL._url+"vinculacion/listar/comunidades/"+external_comunidad).pipe(pluck('data'));
   }

  buscarComunidadByTutor(external_docente){
    return this.http.get(URL._url+"tutor/buscar/comunidad/"+external_docente).pipe(pluck('data'));
  }

  subirImagen(file,external_comunidad){
    return this.http.post(URL._url+"comunidad/subirimagen/"+external_comunidad,file);
  }

  historial(external_comunidad){
    return this.http.get(URL._url+"comunidad/historial/"+external_comunidad).pipe(pluck('data'));
  }
}
