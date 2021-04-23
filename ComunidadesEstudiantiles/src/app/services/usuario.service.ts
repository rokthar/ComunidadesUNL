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

   registrarUsuario(values){
     return this.http.post(URL._url+"usuario/registro",values);
   }
   registrarEstudiante(values, external_us){
    return this.http.post(URL._url+"estudiante/registro/"+external_us,values);
   }
   
   registrarDocente(values, external_us){
    return this.http.post(URL._url+"docente/registro/"+external_us,values);
   }  

   enviarMail(values){
    return this.http.post(URL._url+"utilidad/emviar-mail",values);
   }

   listarDocentesEstado(){
    return this.http.get(URL._url+"docente/listar-docentes").pipe(pluck('data'));
   }

   listarEstudiantesEstado(){
    return this.http.get(URL._url+"estudiante/listar-estudiantes").pipe(pluck('data'));
   }

   ActivarUsuario(external_usuario){
    return this.http.post(URL._url+"usuarios/activar/"+external_usuario,null);
   }

   DesactivarUsuario(external_usuario){
    return this.http.post(URL._url+"usuarios/desactivar/"+external_usuario,null);
   }

   recuperarClave(value){
    return this.http.post(URL._url+"usuarios/recuperar-clave",value);
   }
}
