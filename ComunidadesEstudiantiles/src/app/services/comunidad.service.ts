import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Comunidad } from '../core/model/comunidad';

@Injectable({
  providedIn: 'root'
})
export class ComunidadService {
  url="http://localhost/TT/comunidades/public/";
  constructor(
    private http: HttpClient
  ) {
   }

   registrarComunidad(values,external_docente){
    //return this.http.get(this.url+"comunidad/listar/comunidadesactivadas");
    return this.http.post(this.url+"comunidad/registro/"+external_docente,values);
   }

   listarComunidadesEspera():Observable<Comunidad>{
    return this.http.get(this.url+"secretaria/listar/comunidades").pipe(pluck('data'));
   }

   revisionInformacion(external_comunidad){
    return this.http.post(this.url+"secretaria/activar/"+external_comunidad,null);
   }

   listarComunidadesRevisadas():Observable<Comunidad>{
    return this.http.get(this.url+"gestor/listar/comunidades").pipe(pluck('data'));
   }

   validarComunidad(external_comunidad){
    return this.http.post(this.url+"gestor/activar/"+external_comunidad,null);
   }

   listarComunidadesValidadas():Observable<Comunidad>{
    return this.http.get(this.url+"decano/listar/comundades").pipe(pluck('data'));
   }

   aceptarComunidad(external_comunidad){
    return this.http.post(this.url+"decano/activar/"+external_comunidad,null);
   }

   listarComunidades():Observable<Comunidad>{
    return this.http.get(this.url+"comunidad/listar/comunidadesactivadas").pipe(pluck('data'));
   }
   listarComunidadesVinculacion(external_comunidad):Observable<Comunidad>{
    return this.http.get(this.url+"vinculacion/listar/comunidades/"+external_comunidad).pipe(pluck('data'));
   }

  buscarComunidadByTutor(external_docente){
    return this.http.get(this.url+"tutor/buscar/comunidad/"+external_docente).pipe(pluck('data'));
  }

  subirImagen(file,external_comunidad){
    return this.http.post(this.url+"comunidad/subirimagen/"+external_comunidad,file);
  }

  historial(external_comunidad){
    return this.http.get(this.url+"comunidad/historial/"+external_comunidad).pipe(pluck('data'));
  }
}
