import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Estudiante } from '../core/model/estudiante';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  url="http://localhost/TT/comunidades/public/";
  constructor(
    private http: HttpClient
  ) {
   }

   buscarEstudiante(external):Observable<Estudiante>{
    //return this.http.get(this.url+"comunidad/listar/comunidadesactivadas");
    return this.http.get(this.url+"estudiante/perfil/"+external).pipe(pluck('data'));
   }

   buscarComunidadByMiembro(external_estudiante){
    return this.http.get(this.url+"miembro/buscar-comunidad/"+external_estudiante).pipe(pluck('data'));
   }
}
