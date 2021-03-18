import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Comunidad } from '../core/model/comunidad';
import { Vinculacion } from '../core/model/vinculacion';

@Injectable({
  providedIn: 'root'
})
export class VinculacionService {
  url="http://localhost/TT/comunidades/public/";
  constructor(
    private http: HttpClient
  ) {
   }

   registrarVinculacion(ext_comunidad,ext_comunidad_solic,values){
    return this.http.post(this.url+"comunidad/vinculacion/"+ext_comunidad+"/"+ext_comunidad_solic,values);
   }

   activarVinculacion(external_vinculacion){
    return this.http.post(this.url+"comunidad/activarvinculacion/"+external_vinculacion,null);
   }

   rechazarVinculación(external_vinculacion){
    return this.http.post(this.url+"vinculacion/rechazar/"+external_vinculacion,null);
   }

   listarVinculacionComunidad(external_comunidad):Observable<Vinculacion>{
    return this.http.get(this.url+"comunidad/listarsolicitud/vinculacion/"+external_comunidad).pipe(pluck('data'));

   }
}