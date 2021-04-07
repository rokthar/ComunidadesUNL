import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Estudiante } from '../core/model/estudiante';
import { URL } from '../core/constants/url';


@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  // url="http://localhost/TT/ComunidadesUNL/comunidades/public/";
  // url = "https://comunidadesestudiantiles.000webhostapp.com/comunidades/public/";
  constructor(
    private http: HttpClient
  ) {
   }

   buscarEstudiante(external):Observable<Estudiante>{
    //return this.http.get(this.url+"comunidad/listar/comunidadesactivadas");
    return this.http.get(URL._url+"estudiante/perfil/"+external).pipe(pluck('data'));
   }

   buscarComunidadByMiembro(external_estudiante){
    return this.http.get(URL._url+"miembro/buscar-comunidad/"+external_estudiante).pipe(pluck('data'));
   }

   editarEstudiante(values, external_estudiante){
    return this.http.post(URL._url+"estudiante/editar/"+external_estudiante,values);
   }
   editarEstudianteClave(values, external_estudiante){
    return this.http.post(URL._url+"estudiante/editar-clave/"+external_estudiante,values);
   }
}
