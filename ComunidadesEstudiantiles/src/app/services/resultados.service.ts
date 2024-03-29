import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Estudiante } from '../core/model/estudiante';
import { URL } from '../core/constants/url';


@Injectable({
  providedIn: 'root'
})
export class ResultadosService {
  // url="http://localhost/TT/ComunidadesUNL/comunidades/public/";
  // url = "https://comunidadesestudiantiles.000webhostapp.com/comunidades/public/";

  constructor(
    private http: HttpClient
  ) {
   }

   registrarResultado(values,external_det_actividad){
    return this.http.post(URL._url+"comunidad/resultados/"+external_det_actividad,values);
   }

   subirImagenes(values,external_resultado){
    return this.http.post(URL._url+"comunidad/subirimagen/resultado/"+external_resultado,values);
   }

   listarResultados(){
    return this.http.get(URL._url+"comunidad/listar/resultados").pipe(pluck('data'));
   }

   listarResultadoByComunidad(external_comunidad){
    return this.http.get(URL._url+"comunidad/listar/resultadoscomunidad/"+external_comunidad).pipe(pluck('data'));
   }
   listarResultadoByMiembro(external_estudiante){
    return this.http.get(URL._url+"comunidad/presentar/resultado/miembros/"+external_estudiante).pipe(pluck('data'));
   }

   listarResultado(external_comunidad){
    return this.http.get(URL._url+"/ver/resultado/"+external_comunidad).pipe(pluck('data'));
   }
}