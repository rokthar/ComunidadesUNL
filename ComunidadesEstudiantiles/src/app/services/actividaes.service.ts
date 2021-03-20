import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Estudiante } from '../core/model/estudiante';

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {
  url="http://localhost/TT/ComunidadesUNL/comunidades/public/";

  constructor(
    private http: HttpClient
  ) {
   }


   registrarActividades(external_docente){
    return this.http.post(this.url+"comunidad/planficaractividades/"+external_docente,null);
   }

   registrarDetallesActividades(values,external_actividades){
    return this.http.post(this.url+"comunidad/detalleactividad/"+external_actividades,values);
   }

   listarPlanificacion(){
    return this.http.get(this.url+"comunidad/actividadesespera").pipe(pluck('data'));
   }

   listarPlanificacionByComunidad(external_comunidad){
    return this.http.get(this.url+"comunidad/listar/actividades/"+external_comunidad).pipe(pluck('data'));
   }

   aceptarActividades(external_actividades){
    return this.http.post(this.url+"comunidad/activaractividad/"+external_actividades,null);
   }

   rechazarActividades(external_actividades){
    return this.http.post(this.url+"actividades/rechazar/"+external_actividades,null);
   }
}