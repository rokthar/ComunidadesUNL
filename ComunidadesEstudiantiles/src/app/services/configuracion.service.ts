import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Comunidad } from '../core/model/comunidad';
import { URL } from '../core/constants/url';


@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  constructor(private http: HttpClient) {}
    
  editarMail(values){
    return this.http.post(URL._url+"configuracion/mail",values);
  }
  editarClave(values){
    return this.http.post(URL._url+"configuracion/clave",values);
  }
  configuraciones(){
    return this.http.get(URL._url+"configuracion/ver").pipe(pluck('data'));
  }
}
