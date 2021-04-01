import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Estudiante } from '../core/model/estudiante';
import { URL } from '../core/constants/url';

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {
  // url="http://localhost/TT/ComunidadesUNL/comunidades/public/";
  // url = "https://comunidadesestudiantiles.000webhostapp.com/comunidades/public/";

  constructor(
    private http: HttpClient
  ) {
   }


   registrarActividades(external_docente){
    return this.http.post(URL._url+"comunidad/planficaractividades/"+external_docente,null);
   }

   registrarDetallesActividades(values,external_actividades){
    return this.http.post(URL._url+"comunidad/detalleactividad/"+external_actividades,values);
   }

   listarPlanificacion(){
    return this.http.get(URL._url+"comunidad/actividadesespera").pipe(pluck('data'));
   }

   listarPlanificacionByComunidad(external_comunidad){
    return this.http.get(URL._url+"comunidad/listar/actividades/"+external_comunidad).pipe(pluck('data'));
   }
   actividadesGenerarResultados(external_comunidad){
    return this.http.get(URL._url+"comunidad/generar/resultados/"+external_comunidad).pipe(pluck('data'));
   }

   aceptarActividades(values,external_actividades){
    return this.http.post(URL._url+"comunidad/activaractividad/"+external_actividades,values);
   }

   rechazarActividades(values,external_actividades){
    return this.http.post(URL._url+"actividades/rechazar/"+external_actividades,values);
   }
}