import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Usuario } from '../core/model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  url="http://localhost/TT/ComunidadesUNL/comunidades/public/";
  constructor(
    private http: HttpClient
  ) {
   }

   loginUsuarios(values):Observable<Usuario>{
    //return this.http.get(this.url+"comunidad/listar/comunidadesactivadas");
    return this.http.post(this.url+"usuario/login",values).pipe(pluck('data'));
   }
}
