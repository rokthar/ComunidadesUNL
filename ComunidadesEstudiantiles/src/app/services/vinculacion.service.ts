import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Comunidad } from '../core/model/comunidad';
import { Vinculacion } from '../core/model/vinculacion';
import { URL } from '../core/constants/url';


@Injectable({
  providedIn: 'root'
})
export class VinculacionService {
  url="http://localhost/TT/ComunidadesUNL/comunidades/public/";
  // url = "https://comunidadesestudiantiles.000webhostapp.com/comunidades/public/";
  constructor(
    private http: HttpClient
  ) {
   }

   registrarVinculacion(ext_comunidad,ext_comunidad_solic,values){
    return this.http.post(this.url+"comunidad/vinculacion/"+ext_comunidad+"/"+ext_comunidad_solic,values);
   }

   activarVinculacion(values,external_vinculacion){
    return this.http.post(this.url+"comunidad/activarvinculacion/"+external_vinculacion,values);
   }

   rechazarVinculación(values,external_vinculacion){
    return this.http.post(this.url+"vinculacion/rechazar/"+external_vinculacion,values);
   }

   listarVinculacionComunidad(external_comunidad):Observable<Vinculacion>{
    return this.http.get(this.url+"comunidad/listarsolicitud/vinculacion/"+external_comunidad).pipe(pluck('data'));

   }
}