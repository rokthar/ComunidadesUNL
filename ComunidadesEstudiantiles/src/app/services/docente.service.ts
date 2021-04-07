import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Docente } from '../core/model/docente';
import { URL } from '../core/constants/url';


@Injectable({
  providedIn: 'root'
})
export class DocenteService {
  // url="http://localhost/TT/ComunidadesUNL/comunidades/public/";
  // url = "https://comunidadesestudiantiles.000webhostapp.com/comunidades/public/";
  constructor(
    private http: HttpClient
  ) {
   }

   buscarDocente(external):Observable<Docente>{
    //return this.http.get(this.url+"comunidad/listar/comunidadesactivadas");
    return this.http.get(URL._url+"docente/perfil/"+external).pipe(pluck('data'));
   }

   editarDocente(values,external_docente){
    return this.http.post(URL._url+"docente/editar/"+external_docente,values);
   }
   editarDocenteClave(values,external_docente){
    return this.http.post(URL._url+"docente/editar-clave/"+external_docente,values);
   }
}
