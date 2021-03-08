import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Docente } from '../core/model/docente';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {
  url="http://localhost/TT/comunidades/public/";
  constructor(
    private http: HttpClient
  ) {
   }

   buscarDocente(external):Observable<Docente>{
    //return this.http.get(this.url+"comunidad/listar/comunidadesactivadas");
    return this.http.get(this.url+"docente/perfil/"+external).pipe(pluck('data'));
   }
}
