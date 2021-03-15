import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Estudiante } from '../core/model/estudiante';

@Injectable({
  providedIn: 'root'
})
export class ResultadosService {
  url="http://localhost/TT/comunidades/public/";

  constructor(
    private http: HttpClient
  ) {
   }

   registrarResultado(values,external_det_actividad){
    return this.http.post(this.url+"comunidad/resultados/"+external_det_actividad,values);
   }

   subirImagenes(values,external_resultado){
    return this.http.post(this.url+"comunidad/subirimagen/resultado/"+external_resultado,values);
   }

   listarResultados(){
    return this.http.get(this.url+"comunidad/listar/resultados").pipe(pluck('data'));
   }

   listarResultadoByComunidad(external_comunidad){
    return this.http.get(this.url+"comunidad/listar/resultadoscomunidad/"+external_comunidad).pipe(pluck('data'));
   }
   listarResultadoByMiembro(external_estudiante){
    return this.http.get(this.url+"comunidad/presentar/resultado/miembros/"+external_estudiante).pipe(pluck('data'));
   }

   listarResultado(external_comunidad){
    return this.http.get(this.url+"/ver/resultado/"+external_comunidad).pipe(pluck('data'));
   }
}