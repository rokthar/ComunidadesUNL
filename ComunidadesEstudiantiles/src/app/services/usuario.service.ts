import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Usuario } from '../core/model/usuario';
import { URL } from '../core/constants/url';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // url="http://localhost/TT/ComunidadesUNL/comunidades/public/";
  // url = "https://comunidadesestudiantiles.000webhostapp.com/comunidades/public/";
  constructor(
    private http: HttpClient
  ) {
   }

   loginUsuarios(values){
    //return this.http.get(this.url+"comunidad/listar/comunidadesactivadas");
    return this.http.post(URL._url+"usuario/login",values).pipe(pluck('data'));
   }

   enviarMail(values){
    return this.http.post(URL._url+"utilidad/emviar-mail",values);
   }
}
